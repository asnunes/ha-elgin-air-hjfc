import { LitElement, html, css, CSSResultGroup, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("elgin-display-toggle")
export class DisplayToggle extends LitElement {
  @property({ type: Boolean }) public on = false;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: inline-flex;
      }
      .wrap {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 4px 6px;
        border-radius: 18px;
        color: var(--primary-text-color);
        transition: background 0.15s ease;
      }
      .wrap:hover {
        background: var(--secondary-background-color);
      }
      .icon {
        display: inline-flex;
        align-items: center;
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        transition: color 0.15s ease;
      }
      .wrap.on .icon {
        color: var(--primary-color);
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 32px;
        height: 18px;
        border-radius: 9px;
        background: var(--disabled-color, #bbb);
        transition: background 0.15s ease;
        flex: 0 0 auto;
      }
      .knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        transition: left 0.15s ease;
      }
      .wrap.on .switch {
        background: var(--primary-color);
      }
      .wrap.on .knob {
        left: 16px;
      }
    `;
  }

  protected render(): TemplateResult {
    return html`
      <button
        class="wrap ${this.on ? "on" : ""}"
        @click=${this._toggle}
        title="${this.on ? "Desligar display" : "Ligar display"}"
        aria-label="${this.on ? "Desligar display" : "Ligar display"}"
        aria-pressed=${this.on}
      >
        <span class="icon">
          <ha-icon icon="mdi:monitor-dashboard"></ha-icon>
        </span>
        <span class="switch">
          <span class="knob"></span>
        </span>
      </button>
    `;
  }

  private _toggle(): void {
    this.dispatchEvent(
      new CustomEvent("display-toggle", { bubbles: true, composed: true })
    );
  }
}
