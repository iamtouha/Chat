import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from './lib/styles';
import {
  chatIcon,
  closeIcon,
  expandIcon,
  shrinkIcon,
  soundOffIcon,
  soundOnIcon,
} from './lib/icons';

import './components/chat';

const defaultTheme = {
  'background-color': 'hsl(0 0% 100%)',
  'text-color': 'hsl(222.2 84% 4.9%)',

  'primary-color': 'hsl(210 40% 96.1%)',
  'primary-text-color': 'hsl(222 47.4% 11.2%)',

  'fab-color': 'hsl(222.2 47.4% 11.2%)',
  'fab-text-color': 'hsl(210 40% 98%)',

  'sentitem-color': 'hsl(222.2 47.4% 11.2%)',
  'sentitem-text-color': 'hsl(0 0% 100%)',

  'receiveditem-color': 'hsl(210 40% 96.1%)',
  'receiveditem-text-color': 'hsl(222 47.4% 11.2%)',

  'send-btn-color': 'hsl(222.2 47.4% 11.2%)',
  'send-btn-text-color': 'hsl(210 40% 96.1%)',

  'muted-text-color': 'hsl(215.4 16.3% 46.9%)',
  'overflow-screen-color': 'hsl(215.4 16.3% 46.9%)',

  'app-border-radius': '5px',
  'chat-border-radius': '10px',
};

@customElement('chat-widget')
export class ChatWidget extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) fullscreen = false;
  @property({ type: Boolean, reflect: true }) muted = false;
  @property({ type: String }) chatTitle = 'Chat';
  @property({ type: String }) apikey = '';

  @property({ type: Object }) theme = {};

  render() {
    return html`
      <button
        class="toggle-fab ${this.open ? 'open' : ''} ${this.fullscreen
          ? 'hidden'
          : ''}"
        @click=${this._toggleChat}
      >
        ${this.open ? closeIcon : chatIcon}
      </button>
      <div
        class="box ${this.open ? 'open' : ''} ${this.fullscreen ? 'full' : ''}"
      >
        <div class="app-wrapper">
          <div class="header">
            <h3>${this.chatTitle}</h3>
            <div>
              <button
                class="mute-btn"
                @click=${() => (this.muted = !this.muted)}
              >
                ${this.muted ? soundOffIcon : soundOnIcon}
              </button>
              <button
                class="full-close-btn ${this.fullscreen ? '' : 'hidden'}"
                @click=${this._toggleChat}
              >
                ${closeIcon}
              </button>
              <button class="resize-btn" @click=${this._expandChat}>
                ${this.fullscreen ? shrinkIcon : expandIcon}
              </button>
            </div>
          </div>
          <chat-component apikey="${this.apikey}" ?muted="${this.muted}" />
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    const validTheme = Object.entries(this.theme).every(
      ([key, value]) =>
        defaultTheme.hasOwnProperty(key) && typeof value === 'string',
    );
    if (!validTheme) {
      console.error(
        'Invalid theme object. Using default theme instead. Please check the documentation for the correct theme object.',
      );
      this.theme = {};
    }

    const combinedTheme = { ...defaultTheme, ...this.theme };

    const el = this.shadowRoot?.host as HTMLElement;

    Object.entries(combinedTheme).forEach(([key, value]) => {
      el?.style.setProperty(`--im-${key}`, value);
    });
  }

  _toggleChat() {
    this.open = !this.open;
    if (!this.open) {
      this.fullscreen = false;
    }
  }
  _expandChat() {
    this.fullscreen = !this.fullscreen;
  }

  static styles = [
    baseStyles,
    css`
      .# {
        display: contents;
      }
      .toggle-fab {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        line-height: 0;
        border-radius: 50%;
        background-color: var(--im-fab-color);
        color: var(--im-fab-text-color);
        border: none;
        outline: none;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        z-index: 9999;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
      }
      .toggle-fab svg {
        width: 30px;
        height: 30px;
      }
      .toggle-fab.open {
        scale: 0.85;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background-color: var(--im-primary-color);
        color: var(--im-primary-text-color);
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
      }
      .box {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        position: fixed;
        right: 20px;
        bottom: 70px;
        width: 330px;
        height: 450px;
        opacity: 0;
        transform: translateY(40px);
        transition: all 0.3s ease-in-out;
        z-index: 9998;
        visibility: hidden;
      }
      .box.full {
        width: 100%;
        height: 100%;
        border-radius: 0;
        bottom: 0;
        right: 0;
        background-color: var(--im-overflow-screen-color);
      }
      .box.open {
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
      }
      .mute-btn,
      .full-close-btn,
      .resize-btn {
        line-height: 0;
        border: none;
        background-color: transparent;
        color: var(--im-primary-text-color);
        cursor: pointer;
        padding: 5px;
      }
      .mute-btn svg,
      .full-close-btn svg,
      .resize-btn svg {
        width: 20px;
        height: 20px;
      }
      .app-wrapper {
        max-width: 1000px;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        overflow: hidden;
        background-color: var(--im-background-color);
        border-radius: var(--im-app-border-radius);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-widget': ChatWidget;
  }
}
