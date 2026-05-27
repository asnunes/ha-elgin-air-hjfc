# AUX Cloud — Home Assistant Custom Integration

Unofficial HACS integration that talks to the AUX Cloud (Broadlink-based) service to control AUX air conditioners and heat pumps. API is reverse-engineered; there is no official SDK.

- Domain: `aux_cloud`
- Min HA: `2025.4.0` (see `hacs.json`)
- Distribution: HACS custom repo + manual `custom_components/` install
- Runtime deps (declared in `manifest.json`): `aiohttp`, `pycryptodome==3.23.0`

## Layout

```
custom_components/aux_cloud/
  __init__.py          # async_setup_entry, AuxCloudCoordinator (60s polling)
  config_flow.py       # UI config: login -> family/device selection
  const.py             # DOMAIN, PLATFORMS, HA<->AUX mode/fan maps
  util.py              # BaseEntity (shared CoordinatorEntity base)
  climate.py           # AuxACClimateEntity, AuxHeatPumpClimateEntity
  water_heater.py      # AuxWaterHeaterEntity (heat pumps only)
  sensor.py            # SENSORS dict — temp + diagnostic
  switch.py            # SWITCHES dict — power, eco, child lock, etc.
  select.py            # SELECTS dict — quiet mode, auto water temp
  number.py            # NUMBERS dict — power-limit %
  translations/        # en.json, pl.json, el.json
  api/
    aux_cloud.py       # AuxCloudAPI: login, get_families, get_devices, get/set params
    aux_cloud_ws.py    # AuxCloudWebSocket (built, not yet wired into runtime)
    const.py           # Param keys (AC_*/HP_*), AuxProducts product-id catalog
    util.py            # encrypt_aes_cbc_zero_padding
demo.py / demo_ws.py   # Standalone scripts hitting the cloud API directly
tests/                 # pytest + pytest-homeassistant-custom-component
```

`PLATFORMS` in `const.py` is the authoritative list of platforms forwarded by `async_setup_entry` — keep it in sync when adding a new platform file.

## Architecture

- **Entry point**: `async_setup_entry` builds an `AuxCloudAPI(region)`, logs in, creates `AuxCloudCoordinator`, runs first refresh, then forwards to `PLATFORMS`.
- **Coordinator** (`AuxCloudCoordinator` in `__init__.py`) polls every `MIN_TIME_BETWEEN_UPDATES = 60s`. For every family it fans out 2 requests (owned + shared devices) via `asyncio.gather`; per-device param fetches also run concurrently inside `get_devices`.
- **Auth**: AES-CBC zero-padded body encryption with key derived from `md5(timestamp + TIMESTAMP_TOKEN_ENCRYPT_KEY)`; `loginsession`/`userid` persisted on the `AuxCloudAPI` instance. App headers are spoofed (`SPOOF_APP_VERSION`, Android UA). Session expiry / re-login is a known TODO.
- **Regions**: `eu`, `usa`, `cn`, `rus` map to distinct `app-service-*` hosts. WS endpoints exist for `eu`/`usa`/`cn` only.
- **Entities** all extend `util.BaseEntity` (CoordinatorEntity). Unique id pattern: `f"{DOMAIN}_{device_id.lstrip('0')}_{entity_description.key}"` — do not change without a migration plan; existing installs depend on this. Device grouping uses `(DOMAIN, endpointId)` identifier + MAC connection.
- **Setup gating**: each platform iterates `coordinator.data["devices"]` and checks `AuxProducts.get_params_list` / `get_special_params_list` to decide which entities to create per device. Adding a new switch/sensor/etc. means: add the param to `api/const.py`, include it in the product's params list, then register it in the platform's top-level dict.

## Device model

`api/const.py` is the source of truth for what AUX exposes:

- `AuxProducts.DeviceType.AC_GENERIC` — two product IDs (`c0620000`, `2a4e0000`).
- `AuxProducts.DeviceType.HEAT_PUMP` — `c3aa0000`.
- `AuxProducts.is_v3_heat_pump(device)` — checks `device["extern"].ver >= 3` AND that productId is in HEAT_PUMP. v3+ heat pumps need:
  - `"ver"` requested as a param when GETing snapshot data,
  - `"ver"` injected as `[{"idx":1,"val":3}]` on every SET (handled in `_act_device_params`),
  - tank temperature decoded from `key_states` hex via `_decode_v3_hp_tank_temp_from_key_states` (`temp_c = bytes[2] - 32`, stored as ×10 to match other temps).
- All temperatures are stored ×10 internally (e.g. `temp=240` → 24.0 °C). Convert at the entity boundary, not inside the API layer.

## Conventions

- Code and comments: English only.
- Black formatting; flake8 max line 88; pylint must score ≥ 9.7 in CI (`.github/workflows/pylint.yml`).
- Public/important functions go at the top of the file; auxiliary/private helpers at the bottom.
- Prefer early exits over deep `if` nesting.
- Never use `git add -A` / `git add .` — stage specific files.
- Don't commit unless explicitly asked.
- Don't add features or refactors beyond what was requested.

## Running things

```bash
# Tests
pip install -r requirements.test.txt
pytest                          # full suite, asyncio_mode=auto, coverage on by default
pytest --cov=custom_components  # explicit coverage
# Do not run tests unless explicitly told to; let the user run them.

# Lint / format
pylint custom_components/aux_cloud      # must stay ≥ 9.7
black custom_components/aux_cloud

# Manual API sanity (outside HA)
python demo.py        # needs docs/dev/config.yaml with email/password/shared
python demo_ws.py     # exercises the WebSocket client
```

## Things to know before changing

- **Adding a new region**: append to the `self.url` dict in `AuxCloudAPI.__init__`, the config-flow region list (`["eu", "usa", "cn", "rus"]`), and the WS URL switch in `aux_cloud_ws.py` if WS is needed.
- **Adding a new param**: define the constant + on/off dicts in `api/const.py`, append to the relevant `AC_PARAMS`/`HP_PARAMS` (or `_SPECIAL_PARAMS`) list, then register the entity in the corresponding platform dict (`SWITCHES`/`SENSORS`/`SELECTS`/`NUMBERS`). Entity selection per device is driven by whether the param is in that product's param list.
- **Heat-pump quirks**: anything reading `HP_HOT_WATER_TANK_TEMPERATURE` or writing setpoints must branch on `AuxProducts.is_v3_heat_pump(device)` — v3 stores temps ×10 while older firmware stored ×1. See `water_heater.py` and `sensor.py` for the pattern.
- **Login is per-process**: the AUX mobile app will invalidate the integration's session when the user logs into the app (Android at least). README documents this; reload the integration after using the app.
- **WebSocket client exists but is not connected** by the coordinator — `initialize_websocket` is implemented and there's a `demo_ws.py`, but the coordinator still polls. README's TODO list is the current source of truth on what's planned.
