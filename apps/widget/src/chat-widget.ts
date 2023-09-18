import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './user-form';

@customElement('chat-widget')
export class ChatWidget extends LitElement {
  @property({ type: Boolean }) open = false;
  @property() clientid = '';
  @property() conversationid = '';

  _serverUrl = import.meta.env.VITE_APP_SERVER_URL as string;
  _conversationLoading = false;

  render() {
    return html` <div class="box ${this.open ? 'open' : ''}">
      <button class="toggle-btn" @click="${() => (this.open = !this.open)}">
        ${this.open ? 'Close Chat' : 'Start Chat'}
      </button>
      <div class="chat-box">
        <user-form
          ?show="${!this.conversationid.length}"
          ?loading="${this._conversationLoading}"
        ></user-form>
      </div>
    </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    const conversationid = localStorage.getItem('conversationid');
    if (conversationid) {
      this.conversationid = conversationid;
    }
    console.log(this._serverUrl);
    this.addEventListener('user-form-submit', async (e) => {
      const data = (e as CustomEvent).detail;
      await this._createConversation(data);
    });
  }

  _createConversation = async (info: { name: string; email: string }) => {
    this._conversationLoading = true;
    const response = await fetch(`${this._serverUrl}/api/v1/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    });
    if (!response.ok) {
      this._conversationLoading = false;
      return;
    }
    const data = await response.json();
    this._conversationLoading = false;
    this.conversationid = data.conversationId;
    localStorage.setItem('conversationid', data.conversationid);
  };

  static styles = css`
    :host {
      box-sizing: border-box;
      font-family: sans-serif;
      margin: 0;
      padding: 0;
      color: #2c2c2c;
    }
    .box {
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      position: fixed;
      right: 20px;
      bottom: 0px;
      width: 300px;
      height: 400px;
      overflow: hidden;
      transform: translateY(360px);
      transition: transform 0.3s ease-in-out;
    }
    .box.open {
      transform: translateY(0);
    }
    .toggle-btn {
      background-color: #2c2c2c;
      border: 0;
      color: #fff;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      width: 100%;
      height: 40px;
    }
    .chat-box {
      padding: 10px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-widget': ChatWidget;
  }
}
