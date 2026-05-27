"""Climate platform for AUX Cloud integration."""

from homeassistant.components.climate import (
    ClimateEntity,
    ClimateEntityFeature,
    ClimateEntityDescription,
    HVACMode,
    HVACAction,
)
from homeassistant.components.climate.const import (
    FAN_AUTO,
    SWING_OFF,
    SWING_VERTICAL,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_TEMPERATURE, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .api.const import (
    AC_FAN_SPEED,
    AUX_MODE,
    AC_SWING_VERTICAL,
    AC_SWING_VERTICAL_OFF,
    AC_SWING_VERTICAL_ON,
    AC_TEMPERATURE_AMBIENT,
    AC_TEMPERATURE_TARGET,
    AuxProducts,
    AC_POWER,
    AC_POWER_OFF,
    AC_POWER_ON,
    ACFanSpeed,
)
from .const import (
    DOMAIN,
    FAN_MODE_HA_TO_AUX,
    FAN_MODE_AUX_TO_HA,
    MODE_MAP_AUX_AC_TO_HA,
    MODE_MAP_HA_TO_AUX,
    _LOGGER,
)
from .util import BaseEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the AUX climate platform."""
    data = hass.data[DOMAIN][entry.entry_id]
    coordinator = data["coordinator"]

    entities = []

    for device in coordinator.data["devices"]:
        if device.get("productId") in AuxProducts.DeviceType.AC_GENERIC:
            entities.append(
                AuxACClimateEntity(
                    coordinator,
                    device["endpointId"],
                    ClimateEntityDescription(
                        key="ac",
                        name="Air Conditioner",
                        translation_key="aux_ac",
                        icon="mdi:air-conditioner",
                    ),
                )
            )

    if entities:
        async_add_entities(entities, True)
    else:
        _LOGGER.info("No AUX climate devices added")


# pylint: disable=abstract-method
class AuxACClimateEntity(BaseEntity, CoordinatorEntity, ClimateEntity):
    """AUX Cloud climate entity."""

    def __init__(
        self, coordinator, device_id, entity_description: ClimateEntityDescription
    ):
        """Initialize the climate entity."""
        super().__init__(coordinator, device_id, entity_description)
        self._attr_temperature_unit = UnitOfTemperature.CELSIUS
        self._attr_supported_features = (
            ClimateEntityFeature.TARGET_TEMPERATURE
            | ClimateEntityFeature.FAN_MODE
            | ClimateEntityFeature.SWING_MODE
            | ClimateEntityFeature.TURN_ON
            | ClimateEntityFeature.TURN_OFF
        )
        self._attr_hvac_modes = [HVACMode.OFF, *MODE_MAP_AUX_AC_TO_HA.values()]
        self._attr_fan_modes = list(FAN_MODE_HA_TO_AUX.keys())
        self._attr_swing_modes = [SWING_OFF, SWING_VERTICAL]
        self._attr_min_temp = 17
        self._attr_max_temp = 32
        self._attr_target_temperature_step = 0.5
        self.entity_id = f"climate.{self._attr_unique_id}"

    @property
    def current_temperature(self):
        """Return the current temperature."""
        return (
            self._get_device_params().get(AC_TEMPERATURE_AMBIENT, None) / 10
            if AC_TEMPERATURE_AMBIENT in self._get_device_params()
            else None
        )

    @property
    def target_temperature(self):
        """Return the target temperature."""
        return (
            self._get_device_params().get(AC_TEMPERATURE_TARGET, None) / 10
            if AC_TEMPERATURE_TARGET in self._get_device_params()
            else None
        )

    async def async_set_temperature(self, **kwargs):
        """Set new target temperature."""
        if ATTR_TEMPERATURE not in kwargs:
            return

        temperature = kwargs[ATTR_TEMPERATURE]
        if temperature < self._attr_min_temp:
            temperature = self._attr_min_temp
        elif temperature > self._attr_max_temp:
            temperature = self._attr_max_temp

        await self._set_device_params({AC_TEMPERATURE_TARGET: int(temperature * 10)})

    @property
    def hvac_mode(self):
        """Return the current operation mode."""
        mode = self._get_device_params().get(AUX_MODE, None)
        if mode is None or not self._get_device_params().get(AC_POWER, False):
            return HVACMode.OFF
        return MODE_MAP_AUX_AC_TO_HA.get(mode, HVACMode.OFF)

    async def async_set_hvac_mode(self, hvac_mode):
        """Set a new operation mode."""
        if hvac_mode == HVACMode.OFF:
            params = AC_POWER_OFF
        else:
            aux_mode = MODE_MAP_HA_TO_AUX.get(hvac_mode)
            if aux_mode is None:
                return
            params = {**AC_POWER_ON, AUX_MODE: aux_mode}

        await self._set_device_params(params)

    @property
    def hvac_action(self):
        """Return the current HVAC action."""
        if self.hvac_mode == HVACMode.OFF:
            return HVACAction.OFF
        if self.hvac_mode == HVACMode.HEAT:
            return HVACAction.HEATING
        if self.hvac_mode == HVACMode.COOL:
            return HVACAction.COOLING
        if self.hvac_mode == HVACMode.DRY:
            return HVACAction.DRYING
        if self.hvac_mode == HVACMode.FAN_ONLY:
            return HVACAction.FAN

        return HVACAction.IDLE

    @property
    def fan_mode(self):
        """Return the fan mode."""
        return FAN_MODE_AUX_TO_HA.get(
            self._get_device_params().get(ACFanSpeed.PARAM_NAME), FAN_AUTO
        )

    async def async_set_fan_mode(self, fan_mode):
        """Async set new fan mode."""
        if fan_mode is None:
            return

        await self._set_device_params({AC_FAN_SPEED: FAN_MODE_HA_TO_AUX[fan_mode]})

    @property
    def swing_mode(self):
        """Return the swing mode."""
        if bool(self._get_device_params().get(AC_SWING_VERTICAL, 0)):
            return SWING_VERTICAL
        return SWING_OFF

    async def async_set_swing_mode(self, swing_mode):
        """Set new swing mode."""
        params = (
            AC_SWING_VERTICAL_ON if swing_mode == SWING_VERTICAL else AC_SWING_VERTICAL_OFF
        )
        await self._set_device_params(params)

    async def async_turn_on(self):
        """Async turn the entity on."""
        await self._set_device_params(AC_POWER_ON)

    async def async_turn_off(self):
        """Async turn the entity off."""
        await self._set_device_params(AC_POWER_OFF)
