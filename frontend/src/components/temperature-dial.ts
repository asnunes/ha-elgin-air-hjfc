import { LitElement, html, css, CSSResultGroup, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface TemperatureStepDetail {
  delta: number;
}

const STEP = 0.5;

@customElement("elgin-temperature-dial")
export class TemperatureDial extends LitElement {
  @property({ type: Number }) public target?: number;
  @property({ type: Number }) public current?: number;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }
      .row {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 10px;
        margin: 4px 0 8px;
      }
      .target {
        font-size: 36px;
        font-weight: 300;
        line-height: 1;
        color: var(--primary-text-color);
      }
      .target .unit {
        font-size: 0.5em;
        margin-left: 2px;
        color: var(--secondary-text-color);
      }
      .sep {
        color: var(--secondary-text-color);
        font-size: 0.8rem;
      }
      .current {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
      }
      .step-row {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .step {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--divider-color);
        background: transparent;
        color: var(--primary-text-color);
        font-size: 16px;
        padding: 0;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.05s ease;
      }
      .step:hover {
        background: var(--secondary-background-color);
      }
      .step:active {
        transform: scale(0.94);
      }
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="row">
        <div class="target">
          ${this.target !== undefined ? this.target.toFixed(1) : "—"}<span
            class="unit"
            >°C</span
          >
        </div>
        <div class="sep">·</div>
        <div class="current">
          Atual:
          ${this.current !== undefined ? `${this.current.toFixed(1)}°C` : "—"}
        </div>
      </div>
      <div class="step-row">
        <button
          class="step"
          @click=${() => this._step(-STEP)}
          aria-label="Diminuir temperatura"
        >
          −
        </button>
        <button
          class="step"
          @click=${() => this._step(STEP)}
          aria-label="Aumentar temperatura"
        >
          +
        </button>
      </div>
    `;
  }

  private _step(delta: number): void {
    this.dispatchEvent(
      new CustomEvent<TemperatureStepDetail>("temperature-step", {
        detail: { delta },
        bubbles: true,
        composed: true,
      })
    );
  }
}
