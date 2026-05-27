import { LitElement, html, css, CSSResultGroup, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { CardConfig, HomeAssistant } from "./types.js";
import { findDisplaySwitchEntity } from "./utils/entity-discovery.js";
import "./components/temperature-dial.js";
import "./components/hvac-mode-selector.js";
import "./components/display-toggle.js";
import type { TemperatureStepDetail } from "./components/temperature-dial.js";
import type { HvacModeChangeDetail } from "./components/hvac-mode-selector.js";

const MIN_TEMP_DEFAULT = 17;
const MAX_TEMP_DEFAULT = 32;

@customElement("elgin-thermostat-card")
export class ElginThermostatCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: CardConfig;

  public setConfig(config: CardConfig): void {
    if (!config?.entity) {
      throw new Error("'entity' (a climate.* entity_id) is required");
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 4;
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        padding: 14px 16px 12px;
        font-family: var(
          --mdc-typography-body1-font-family,
          var(--paper-font-body1_-_font-family, Roboto, sans-serif)
        );
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 6px;
      }
      .name {
        font-size: 1rem;
        font-weight: 500;
        color: var(--primary-text-color);
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .error {
        color: var(--error-color);
        padding: 16px;
      }
    `;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const climate = this.hass.states[this._config.entity];
    if (!climate) {
      return html`<ha-card
        ><div class="error">Entity not found: ${this._config.entity}</div></ha-card
      >`;
    }

    const target = climate.attributes.temperature as number | undefined;
    const current = climate.attributes.current_temperature as number | undefined;
    const hvacMode = climate.state;
    const hvacModes = (climate.attributes.hvac_modes as string[]) ?? [];
    const headerName =
      this._config.name ??
      (climate.attributes.friendly_name as string | undefined) ??
      "Ar-condicionado";

    const displayEntityId =
      this._config.display_entity ??
      findDisplaySwitchEntity(this.hass, this._config.entity);
    const displayOn = displayEntityId
      ? this.hass.states[displayEntityId]?.state === "on"
      : false;

    return html`
      <ha-card>
        <div class="header">
          <div class="name">${headerName}</div>
          ${displayEntityId
            ? html`
                <elgin-display-toggle
                  .on=${displayOn}
                  @display-toggle=${() =>
                    this._toggleDisplay(displayEntityId)}
                ></elgin-display-toggle>
              `
            : ""}
        </div>
        <elgin-temperature-dial
          .target=${target}
          .current=${current}
          @temperature-step=${this._onTemperatureStep}
        ></elgin-temperature-dial>
        <elgin-hvac-mode-selector
          .modes=${hvacModes}
          .current=${hvacMode}
          @hvac-mode-change=${this._onHvacModeChange}
        ></elgin-hvac-mode-selector>
      </ha-card>
    `;
  }

  private _onTemperatureStep(e: CustomEvent<TemperatureStepDetail>): void {
    const climate = this.hass.states[this._config.entity];
    const current = (climate.attributes.temperature as number | undefined) ?? 24;
    const minT =
      (climate.attributes.min_temp as number | undefined) ?? MIN_TEMP_DEFAULT;
    const maxT =
      (climate.attributes.max_temp as number | undefined) ?? MAX_TEMP_DEFAULT;
    const next = Math.max(minT, Math.min(maxT, current + e.detail.delta));
    this.hass.callService("climate", "set_temperature", {
      entity_id: this._config.entity,
      temperature: next,
    });
  }

  private _onHvacModeChange(e: CustomEvent<HvacModeChangeDetail>): void {
    this.hass.callService("climate", "set_hvac_mode", {
      entity_id: this._config.entity,
      hvac_mode: e.detail.mode,
    });
  }

  private _toggleDisplay(entityId: string): void {
    this.hass.callService("switch", "toggle", { entity_id: entityId });
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "elgin-thermostat-card",
  name: "Elgin Thermostat",
  description: "Termostato Elgin Air HJFC com toggle de display embutido",
});
