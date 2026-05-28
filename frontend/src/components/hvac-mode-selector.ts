import { LitElement, html, css, CSSResultGroup, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface HvacModeChangeDetail {
  mode: string;
}

const MODE_LABEL: Record<string, string> = {
  off: "Off",
  auto: "Auto",
  cool: "Cool",
  dry: "Dry",
  fan_only: "Fan",
};

@customElement("elgin-hvac-mode-selector")
export class HvacModeSelector extends LitElement {
  @property({ type: Array }) public modes: string[] = [];
  @property({ type: String }) public current = "";

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }
      .modes {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .mode {
        padding: 4px 10px;
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease,
          border-color 0.15s ease;
      }
      .mode:hover {
        background: var(--secondary-background-color);
      }
      .mode.active {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-color: transparent;
      }
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="modes">
        ${this.modes.map(
          (m) => html`
            <button
              class="mode ${m === this.current ? "active" : ""}"
              @click=${() => this._select(m)}
            >
              ${MODE_LABEL[m] ?? m}
            </button>
          `
        )}
      </div>
    `;
  }

  private _select(mode: string): void {
    this.dispatchEvent(
      new CustomEvent<HvacModeChangeDetail>("hvac-mode-change", {
        detail: { mode },
        bubbles: true,
        composed: true,
      })
    );
  }
}
