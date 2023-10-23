import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from './lib/styles';
import { chatIcon, closeIcon, expandIcon, shrinkIcon } from './lib/icons';

import './components/chat';

@customElement('chat-widget')
export class ChatWidget extends LitElement {
  @property({ type: Boolean }) open = false;
  @property({ type: Boolean }) fullscreen = false;
  @property({ type: String }) chatTitle = 'Chat';
  @property({ type: String }) apikey = '';

  /** Theme properties */
  @property({ type: String }) backgroundColor = 'hsl(0 0% 100%)';
  @property({ type: String }) foregroundColor = 'hsl(222.2 84% 4.9%)';
  @property({ type: String }) primaryColor = 'hsl(222.2 47.4% 11.2%)';
  @property({ type: String }) primaryForegroundColor = 'hsl(210 40% 98%)';
  @property({ type: String }) secondaryColor = 'hsl(210 40% 96.1%)';
  @property({ type: String }) secondaryForegroundColor = 'hsl(222 47.4% 11.2%)';
  @property({ type: String }) accentColor = 'hsl(222.2 47.4% 11.2%)';
  @property({ type: String }) accentForegroundColor = 'hsl(210 40% 96.1%)';
  @property({ type: String }) mutedColor = 'hsl(210 40% 96.1%)';
  @property({ type: String }) mutedForegroundColor = 'hsl(215.4 16.3% 46.9%)';
  @property({ type: String }) appBorderRadius = '5px';
  @property({ type: String }) chatBorderRadius = '10px';

  render() {
    return html`<button
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
        <div class="header">
          <h3>${this.chatTitle}</h3>
          <div>
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
        <div class="app-wrapper">
          <chat-component apikey="${this.apikey}" />
        </div>
      </div>`;
  }

  connectedCallback() {
    super.connectedCallback();

    const theme = {
      background: this.backgroundColor,
      foreground: this.foregroundColor,
      primary: this.primaryColor,
      secondary: this.secondaryColor,
      accent: this.accentColor,
      muted: this.mutedColor,
      'primary-foreground': this.primaryForegroundColor,
      'secondary-foreground': this.secondaryForegroundColor,
      'accent-foreground': this.accentForegroundColor,
      'muted-foreground': this.mutedForegroundColor,
      'app-border-radius': this.appBorderRadius,
      'chat-border-radius': this.chatBorderRadius,
    };

    Object.entries(theme).forEach(([key, value]) => {
      const el = this.shadowRoot?.host as HTMLElement;
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
      .toggle-fab {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        line-height: 0;
        border-radius: 50%;
        background-color: var(--im-primary);
        color: var(--im-primary-foreground);
        border: none;
        outline: none;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        z-index: 9999;
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
        background-color: var(--im-primary);
        color: var(--im-primary-foreground);
      }
      .box {
        background-color: var(--im-background);
        border-radius: var(--im-app-border-radius);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        position: fixed;
        right: 20px;
        bottom: 70px;
        width: 330px;
        height: 450px;
        overflow: hidden;
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
      }
      .box.open {
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
      }
      .full-close-btn,
      .resize-btn {
        line-height: 0;
        border: none;
        background-color: transparent;
        color: var(--im-primary-foreground);
        cursor: pointer;
        padding: 5px;
      }
      .full-close-btn svg,
      .resize-btn svg {
        width: 20px;
        height: 20px;
      }
      .app-wrapper {
        height: calc(100% - 50px);
        max-width: 1000px;
        width: 100%;
        margin: 0 auto;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-widget': ChatWidget;
  }
}
