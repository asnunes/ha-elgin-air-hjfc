"""Elgin Air HJFC integration for Home Assistant.

This is a cooling-only fork of the AUX Cloud integration. The Elgin units
are OEM-rebranded AUX/Broadlink ACs sold in Brazil and talk to the AUX
Cloud servers — that's why the backend API client is still named
AuxCloudAPI.
"""

import asyncio
from datetime import timedelta
from pathlib import Path

import voluptuous as vol
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.const import CONF_EMAIL, CONF_PASSWORD, CONF_REGION
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api.aux_cloud import AuxCloudAPI
from .const import (
    _LOGGER,
    DOMAIN,
    DATA_AUX_CLOUD_CONFIG,
    PLATFORMS,
    CONF_SELECTED_DEVICES,
)

MIN_TIME_BETWEEN_UPDATES = timedelta(seconds=60)

FRONTEND_RESOURCE_PATH = "/elg_air_hjfc_frontend"
FRONTEND_RESOURCE_FILE = "elgin-thermostat-card.js"
FRONTEND_RESOURCE_URL = f"{FRONTEND_RESOURCE_PATH}/{FRONTEND_RESOURCE_FILE}"
FRONTEND_REGISTERED_KEY = "elg_air_hjfc_frontend_registered"

# Schema to include email and password (device selection is handled in config flow)
CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Schema(
            {
                vol.Required(CONF_EMAIL): cv.string,
                vol.Required(CONF_PASSWORD): cv.string,
            }
        )
    },
    extra=vol.ALLOW_EXTRA,
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """
    AUX Cloud setup for configuration.yaml import.
    This is mainly kept for backward compatibility.
    UI configuration is recommended for better security.
    """
    if DOMAIN not in config:
        return True

    hass.data[DATA_AUX_CLOUD_CONFIG] = config.get(DOMAIN, {})

    if (
        not hass.config_entries.async_entries(DOMAIN)
        and hass.data[DATA_AUX_CLOUD_CONFIG]
    ):
        # Import from configuration.yaml if no config entry exists
        hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN, context={"source": SOURCE_IMPORT}, data=config[DOMAIN]
            )
        )

        # Log a message about UI configuration being preferred
        _LOGGER.info(
            "AUX Cloud configured via configuration.yaml. For better security, "
            "it is recommended to configure this integration through the UI where "
            "credentials are stored encrypted."
        )

    return True


class AuxCloudCoordinator(DataUpdateCoordinator):
    """DataUpdateCoordinator for AUX Cloud."""

    def __init__(
        self,
        hass: HomeAssistant,
        api: AuxCloudAPI,
        email: str,
        password: str,
        selected_device_ids: list,
    ):
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name="AUX Cloud Coordinator",
            update_interval=MIN_TIME_BETWEEN_UPDATES,
        )
        self.api = api
        self.email = email
        self.password = password
        self.selected_device_ids = selected_device_ids
        self.devices = []

    def get_device_by_endpoint_id(self, endpoint_id: str):
        """Get a device by its endpoint ID."""
        return next(
            (
                device
                for device in self.data.get("devices", [])
                if device.get("endpointId") == endpoint_id
            ),
            None,
        )

    async def _async_update_data(self):
        """Fetch data from AUX Cloud."""
        _LOGGER.debug("Updating AUX Cloud data...")

        try:
            if not self.api.is_logged_in():
                # Attempt to log in
                _LOGGER.debug("Logging into AUX Cloud API...")
                login_success = await self.api.login(self.email, self.password)
                if not login_success:
                    raise UpdateFailed("Login to AUX Cloud API failed")

            if self.api.families is None:
                _LOGGER.debug("Fetching families from AUX Cloud API...")
                await self.api.get_families()

            # Create a single list of tasks for fetching devices (shared and non-shared)
            device_tasks = []

            for family_id in self.api.families:
                device_tasks.append(
                    self.api.get_devices(
                        family_id,
                        shared=False,
                        selected_devices=self.selected_device_ids,
                    )
                )
                device_tasks.append(
                    self.api.get_devices(
                        family_id,
                        shared=True,
                        selected_devices=self.selected_device_ids,
                    )
                )

            # Run all tasks concurrently
            devices_results = await asyncio.gather(
                *device_tasks, return_exceptions=True
            )

            # Process results and handle exceptions
            all_devices = []

            for result in devices_results:
                for device in result:
                    if isinstance(device, Exception):
                        continue
                    if (
                        device["endpointId"] in self.selected_device_ids
                        or not self.selected_device_ids
                    ):
                        all_devices.append(device)

            self.devices = all_devices
            _LOGGER.debug("Fetched AUX Cloud data: %s devices", len(self.devices))

            self.async_set_updated_data({"devices": self.devices})

            return {"devices": self.devices}

        except Exception as e:
            raise UpdateFailed(f"Error updating AUX Cloud data: {e}") from e


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up AUX Cloud from a config entry."""
    if not hass.data.get(FRONTEND_REGISTERED_KEY):
        hass.data[FRONTEND_REGISTERED_KEY] = True
        await _register_frontend(hass)

    region = entry.data.get(CONF_REGION, "eu")
    api = AuxCloudAPI(region=region)
    email = entry.data.get(CONF_EMAIL)
    password = entry.data.get(CONF_PASSWORD)
    selected_device_ids = entry.data.get(CONF_SELECTED_DEVICES, [])

    if not email or not password:
        _LOGGER.error("Missing required credentials for AUX Cloud")
        return False

    coordinator = AuxCloudCoordinator(hass, api, email, password, selected_device_ids)

    # Attempt to log in
    try:
        login_success = await api.login(email, password)
        if not login_success:
            _LOGGER.error("Login to AUX Cloud API failed")
            return False
    except Exception as e:
        _LOGGER.error("Exception during login: %s", e)
        return False

    # Perform an initial update
    await coordinator.async_config_entry_first_refresh()

    # Store the coordinator for platform use
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        "coordinator": coordinator,
        "api": api,
    }

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the config entry and platforms."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data.pop(DOMAIN)
    return unload_ok


async def _register_frontend(hass: HomeAssistant) -> None:
    """Register the custom Lovelace card: static path + auto-register as a resource.

    Static path serves the built `www/elgin-thermostat-card.js` over HTTP.
    The Lovelace resource registration is best-effort: it only works on
    Storage-mode Lovelace, and gracefully degrades to a log warning if the
    HA internals change. Users on YAML-mode Lovelace must add the resource
    manually — see README.
    """
    www_path = Path(__file__).parent / "www"
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_RESOURCE_PATH, str(www_path), False)]
        )
    except Exception as exc:  # pragma: no cover
        _LOGGER.warning("Failed to register static path for frontend card: %s", exc)
        return

    try:
        resources = hass.data["lovelace"].resources
        if not resources.loaded:
            await resources.async_load()
        existing = [
            item
            for item in resources.async_items()
            if item.get("url", "").startswith(FRONTEND_RESOURCE_URL)
        ]
        if existing:
            return
        await resources.async_create_item(
            {"res_type": "module", "url": FRONTEND_RESOURCE_URL}
        )
        _LOGGER.info(
            "Registered Elgin Thermostat Card as Lovelace resource (%s)",
            FRONTEND_RESOURCE_URL,
        )
    except (KeyError, AttributeError, TypeError) as exc:
        _LOGGER.warning(
            "Could not auto-register Lovelace resource (add %s manually under "
            "Settings -> Dashboards -> Resources): %s",
            FRONTEND_RESOURCE_URL,
            exc,
        )
