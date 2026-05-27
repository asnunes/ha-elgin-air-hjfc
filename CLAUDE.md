# AUX Cloud — Home Assistant Custom Integration (AC-only fork)

Unofficial HACS integration that talks to the AUX Cloud (Broadlink-based) service to control AUX air conditioners. API is reverse-engineered; there is no official SDK.

This is an **AC-only personal fork** — heat pump / water heater support was stripped from upstream. The `aux_cloud` domain is intentionally preserved.

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
  climate.py           # AuxACClimateEntity (the only climate entity)
  sensor.py            # SENSORS dict — ambient temp, AC target temp, error flag
  switch.py            # SWITCHES dict — power, eco, child lock, etc.
  translations/        # en.json, pt-BR.json, pl.json, el.json
  api/
    aux_cloud.py       # AuxCloudAPI: login, get_families, get_devices, get/set params
    aux_cloud_ws.py    # AuxCloudWebSocket (built, not yet wired into runtime)
    const.py           # Param keys (AC_*), AuxProducts product-id catalog (AC only)
    util.py            # encrypt_aes_cbc_zero_padding
demo.py / demo_ws.py   # Standalone scripts hitting the cloud API directly
tests/                 # pytest + pytest-homeassistant-custom-component
```

`PLATFORMS` in `const.py` is the authoritative list of platforms forwarded by `async_setup_entry` — keep it in sync when adding a new platform file. Currently: `CLIMATE`, `SENSOR`, `SWITCH`.

## Architecture

- **Entry point**: `async_setup_entry` builds an `AuxCloudAPI(region)`, logs in, creates `AuxCloudCoordinator`, runs first refresh, then forwards to `PLATFORMS`.
- **Coordinator** (`AuxCloudCoordinator` in `__init__.py`) polls every `MIN_TIME_BETWEEN_UPDATES = 60s`. For every family it fans out 2 requests (owned + shared devices) via `asyncio.gather`; per-device param fetches also run concurrently inside `get_devices`.
- **Auth**: AES-CBC zero-padded body encryption with key derived from `md5(timestamp + TIMESTAMP_TOKEN_ENCRYPT_KEY)`; `loginsession`/`userid` persisted on the `AuxCloudAPI` instance. App headers are spoofed (`SPOOF_APP_VERSION`, Android UA). Session expiry / re-login is a known TODO.
- **Regions**: `eu`, `usa`, `cn`, `rus` map to distinct `app-service-*` hosts. WS endpoints exist for `eu`/`usa`/`cn` only.
- **Entities** all extend `util.BaseEntity` (CoordinatorEntity). Unique id pattern: `f"{DOMAIN}_{device_id.lstrip('0')}_{entity_description.key}"` — do not change without a migration plan; existing installs depend on this. Device grouping uses `(DOMAIN, endpointId)` identifier + MAC connection.
- **Setup gating**: each platform iterates `coordinator.data["devices"]` and checks `AuxProducts.get_params_list` / `get_special_params_list` to decide which entities to create per device. Adding a new switch/sensor/etc. means: add the param to `api/const.py`, include it in `AC_PARAMS`, then register it in the platform's top-level dict.

## Device model

`api/const.py` is the source of truth for what AUX exposes:

- `AuxProducts.DeviceType.AC_GENERIC` — two product IDs (`c0620000`, `2a4e0000`). Anything else is filtered out at platform setup time.
- All temperatures are stored ×10 internally (e.g. `temp=240` → 24.0 °C). Convert at the entity boundary, not inside the API layer.
- `tempunit` param exists (`1` = Celsius) but is not read by the integration. Entities declare `UnitOfTemperature.CELSIUS`; HA's system-wide unit setting handles user-facing C↔F conversion.

## AC climate range

`AuxACClimateEntity` is hard-pinned to a **17–32 °C** target range (`climate.py`, `_attr_min_temp` / `_attr_max_temp`). Step is 0.5 °C. If you want to widen this, edit those two attrs — there's no config flow option for it.

## Feature scope (intentional gaps)

This fork targets a single **cooling-only** Elgin HJFC unit. Features outside that scope were stripped:

- **HVAC modes**: `AUTO`, `COOL`, `DRY`, `FAN_ONLY` only. `HEAT` was removed (cooling-only).
- **Auxiliary Heat** (`ac_astheat`): removed — paired with HEAT mode.
- **Swing**: only vertical. Horizontal swing (`ac_hdir`) was removed — Elgin High Wall models only have a motorized vertical louver.
- **Comfortable Wind** (`comfwind`): removed — not described in any of the operation/Wi-Fi manuals.

Protocol metadata params (`new_type`, `ac_tempconvert`, `tempunit`, `sleepdiy`, `tenelec`, `ac_errcode1`, `err_flag`) stay in `AC_PARAMS` so they keep being fetched, even though no entity exposes them today. `sleepdiy` in particular is the data behind the "Dormir Personalizado" feature in the Elgin app — leave it in if you ever wire that up.

If you ever need heating back, you need to put back: `AC_MODE_HEATING` and its entry in `MODE_MAP_AUX_AC_TO_HA`, the `HVACAction.HEATING` branch in `climate.py:hvac_action`, and the `AC_AUXILIARY_HEAT` switch + constants.

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
- **Adding a new param**: define the constant + on/off dicts in `api/const.py`, append to `AuxProducts.AC_PARAMS` (or `AC_SPECIAL_PARAMS`), then register the entity in the corresponding platform dict (`SWITCHES`/`SENSORS`). Entity selection per device is driven by whether the param is in `AC_PARAMS`.
- **Heat pump is intentionally gone**. If you want to bring it back, check the git history for the rip-out commit and revert the relevant files — don't shim around the deletions.
- **Login is per-process**: the AUX mobile app will invalidate the integration's session when the user logs into the app (Android at least). README documents this; reload the integration after using the app.
- **WebSocket client exists but is not connected** by the coordinator — `initialize_websocket` is implemented and there's a `demo_ws.py`, but the coordinator still polls.
- **README.md is out of date** vs. this fork — still mentions heat pumps. Not updated since this is a personal fork; ignore for code reasoning, this CLAUDE.md is the truth.
