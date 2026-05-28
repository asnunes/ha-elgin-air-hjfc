# Elgin Air HJFC for Home Assistant

Home Assistant integration for **cooling-only Elgin HJFC** split air conditioners (Eco Inverter II family, sold in Brazil). Adds the AC as a `climate` entity plus the switches and sensors that the AUX cloud protocol actually exposes — mode, temperature, fan, swing, sleep, anti-mold, self-cleaning, IonAir, child lock, screen display, and ambient/target temperatures.

The Elgin units are OEM-rebranded AUX/Broadlink hardware. The wifi module (BLI206-P or TYAUX-J/J2) talks to the **AUX Cloud** servers — the same backend the *Elgin Air* and *Elgin Smart* mobile apps use. Your Elgin Air credentials work as-is.

This is a personal fork of [maeek/ha-aux-cloud](https://github.com/maeek/ha-aux-cloud). The upstream targets the broader AUX product family (cool/heat ACs, heat pumps, multiple regions, multiple locales). This fork strips everything that does not apply to a single frio HJFC unit.

## What was kept vs. removed

**Kept (vs. upstream)**

- AC climate entity: HVAC modes `AUTO`, `COOL`, `DRY`, `FAN_ONLY`; fan speeds Auto/Low/Med/High/Turbo/Silent; vertical swing
- Sensors: ambient temperature, target temperature, error flag
- Switches: Eco mode, AC power, Self-cleaning, Child lock, IonAir (labeled "Health Mode" internally), Anti-mold, Sleep mode, Screen display
- Locales: English and Brazilian Portuguese
- 17–32 °C target range (hard-coded)

**Removed (and why)**

| Removed | Why |
|---|---|
| Heat pump platform (climate, water_heater, HP switches/sensors/selects) | Not applicable to a split AC |
| HVAC `HEAT` mode + Auxiliary Heat switch | Cooling-only fork — Elgin HJQC (quente/frio) is not the target |
| Horizontal swing (`ac_hdir`) | High Wall units only have a motorized vertical louver |
| Comfortable Wind (`comfwind`) | Not documented in any Elgin manual |
| Power Limit switch + percentage | Out of scope |
| Greek and Polish locales | Brazilian market only |

A full architecture and feature-scope breakdown is in [`CLAUDE.md`](CLAUDE.md).

## Installation

### HACS Custom Repository (recommended)

1. Make sure you have [HACS](https://hacs.xyz/) installed.
2. HACS → menu (⋮) → **Custom repositories**.
3. Add `https://github.com/asnunes/ha-elgin-air-hjfc` as category **Integration**.
4. Install **Elgin Air HJFC**.
5. Restart Home Assistant.

### Manual

1. Copy `custom_components/elg_air_hjfc/` into your Home Assistant `config/custom_components/`.
2. Restart Home Assistant.

## Configuration

After install:

1. **Settings** → **Devices & Services** → **+ Add Integration** → search **Elgin Air HJFC**.
2. Enter your Elgin Air (AUX cloud) account email and password.
3. Pick the region — for Elgin units in Brazil this is **eu** (Elgin Air points to the European Broadlink/AUX server).
4. Select the AC(s) you want to add.

Credentials are stored in HA's `.storage/core.config_entries`.

> [!TIP]
> Make sure the AC is online when adding it. Offline units skip the param fetch and end up with missing entities until you reload the integration.

## Custom Lovelace card (optional)

The integration ships a custom card, `elgin-thermostat-card`, that replaces the default thermostat with a thermostat + inline Display toggle button. It is auto-registered as a Lovelace resource on Storage-mode dashboards (the default). If you run YAML-mode Lovelace, add `/elg_air_hjfc_frontend/elgin-thermostat-card.js` manually under **Settings → Dashboards → Resources** as type *module*.

Usage:

```yaml
type: custom:elgin-thermostat-card
entity: climate.elg_air_hjfc_<id>_ac
# display_entity is auto-discovered from the same device;
# override only if you have multiple climates and want to pin one.
# display_entity: switch.elg_air_hjfc_<id>_scrdisp
# name: Sala
```

## Known limitations

- **Logging into the Elgin Air mobile app invalidates the integration's session** (at least on Android). Reload the integration after using the app.
- **No timer / scheduled on-off entity** — the cloud protocol param for this hasn't been wired into the integration. Use HA automations as a workaround.
- **No "Dormir Personalizado"** — the data (`sleepdiy`) is fetched but not exposed as an entity.
- **Session re-login** on token expiry isn't implemented; if the cloud drops the session you may need to reload the integration.

## Hardware tested

- Elgin Eco Inverter II HJFC, R32 refrigerant, BLI206-P wifi module, accessed via Elgin Air app (region **eu**).

## Privacy

All cloud communication goes to AUX/Broadlink servers (the same ones the Elgin app uses). Credentials are stored locally in HA. Nothing is sent to third parties beyond what the AUX cloud needs to authenticate and control the device.

## Credits

- Upstream: [maeek/ha-aux-cloud](https://github.com/maeek/ha-aux-cloud) — the original reverse-engineered AUX Cloud integration.
- Broadlink SDK references: [docs.ibroadlink.com](https://docs.ibroadlink.com/public/appsdk/sdk_others/dnacontrol/).
- ESPHome alternative (local control by replacing the wifi module): [GrKoR/esphome_aux_ac_component](https://github.com/GrKoR/esphome_aux_ac_component).

## Development

Python side:

```bash
pip install -r requirements.test.txt
pytest
pylint custom_components/elg_air_hjfc --fail-under=9.7
black custom_components/elg_air_hjfc
```

Standalone API smoke tests (outside HA) live in `demo.py` and `demo_ws.py`.

Frontend side (the custom card is a Lit + TypeScript module):

```bash
cd frontend
npm install
npm run typecheck   # tsc --noEmit
npm run build       # bundles to custom_components/elg_air_hjfc/www/elgin-thermostat-card.js
npm run watch       # rebuild on save during development
```

Source layout (`frontend/src/`):

- `elgin-thermostat-card.ts` — main element, config + orchestration
- `components/temperature-dial.ts` — target/current temp + ± buttons
- `components/hvac-mode-selector.ts` — HVAC mode chip row
- `components/display-toggle.ts` — Display on/off pill
- `utils/entity-discovery.ts` — auto-discover the `*_scrdisp` switch from the climate's device
- `types.ts` — minimal HA + config types

The built `.js` is committed under `custom_components/.../www/` so end users don't need Node.
