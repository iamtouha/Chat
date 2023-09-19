import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import dayjs from 'dayjs';
import socket from './socket';
import type { Conversation, Message } from './types';
import './user-form';
import './message-item';

@customElement('chat-widget')
export class ChatWidget extends LitElement {
  @property({ type: Boolean }) open = false;
  @property() clientid = '';

  @state() private _conversationid = '';
  @state() private _conversationLoading = false;
  @state() private _messages: Message[] = [];

  _serverUrl = import.meta.env.VITE_APP_SERVER_URL as string;

  render() {
    return html` <div class="box ${this.open ? 'open' : ''}">
      <button class="toggle-btn" @click="${() => (this.open = !this.open)}">
        ${this.open ? 'Close Chat' : 'Start Chat'}
      </button>
      <user-form
        ?hidden="${!!this._conversationid.length}"
        ?loading="${this._conversationLoading}"
      ></user-form>
      <div class="chat-box ${this._conversationid ? '' : 'hidden'}">
        ${this._messages.map(
          (message) => html`
            <message-item
              ?sender="${message.type === 'OUTBOUND'}"
              content="${message.content}"
              time="${dayjs(message.createdAt).format('hh:mm')}"
            ></message-item>
          `,
        )}
      </div>
      <div class="chat-input ${this._conversationid ? '' : 'hidden'}">
        <input type="text" id="messageBox" placeholder="Type your message..." />
        <button @click="${this._writeMessage}">Send</button>
      </div>
    </div>`;
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    super.requestUpdate(name, oldValue);
    if (name === '_conversationid' && this._conversationid) {
      this._fetchConversation();
      socket.emit('user_connected', this._conversationid);
      socket.on('message_received', (message: Message) => {
        this._messages = [...this._messages, message];
      });
    }
    if (name === '_messages') {
      const chatBox = this.shadowRoot?.querySelector('.chat-box');
      if (!chatBox) return;
      setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 1);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    const conversationid = localStorage.getItem('conversationid');
    if (conversationid) {
      this._conversationid = conversationid;
    }
    this.addEventListener('user-form-submit', async (e) => {
      const data = (e as CustomEvent).detail;
      await this._createConversation(data);
    });
  }

  _writeMessage = async () => {
    const messageInput = this.shadowRoot?.getElementById(
      'messageBox',
    ) as HTMLInputElement;
    if (!this._conversationid || !messageInput.value.length) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput.value,
      type: 'OUTBOUND',
      contentType: 'TEXT',
      seen: false,
      createdAt: new Date().toJSON(),
      conversationId: this._conversationid,
    };
    this._messages = [...this._messages, newMessage];
    messageInput.value = '';
    socket.emit('message_sent', newMessage, this.clientid);
    console.log(this._conversationid);
    const response = await fetch(`${this._serverUrl}/api/v1/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newMessage.content,
        type: newMessage.type,
        conversationId: newMessage.conversationId,
      }),
    });
    if (!response.ok) {
      this._messages = this._messages.filter(
        (message) => message.id !== newMessage.id,
      );

      return;
    }
    const data = await response.json();
    if (data?.status !== 'success') {
      return;
    }
  };

  _createConversation = async (info: { name: string; email: string }) => {
    this._conversationLoading = true;
    const response = await fetch(`${this._serverUrl}/api/v1/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...info, clientId: this.clientid }),
    });
    if (!response.ok) {
      this._conversationLoading = false;
      return;
    }
    const data = await response.json();
    this._conversationLoading = false;
    if (data?.status !== 'success') {
      return;
    }
    this._conversationid = data.result.id;
    socket.emit('conversation_started', data.result, this.clientid);
    localStorage.setItem('conversationid', this._conversationid);
  };

  _fetchConversation = async () => {
    if (!this._conversationid) return;
    const response = await fetch(
      `${this._serverUrl}/api/v1/conversations/${this._conversationid}`,
    );
    if (!response.ok) {
      this._conversationLoading = false;
      return;
    }
    if (response.status === 404) {
      this._conversationid = '';
      localStorage.removeItem('conversationid');
      return;
    }
    const data = await response.json();
    const conv = data.result as Conversation & { messages: Message[] };
    this._messages = conv.messages;
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
    .chat-messages {
      max-height: 300px;
      overflow-y: auto;
      padding: 10px;
    }
    .chat-box {
      padding: 10px;
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      bottom: 40px;
      overflow-y: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .chat-box::-webkit-scrollbar {
      display: none;
    }
    .chat-input {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: #f5f5f5;
      border-top: 1px solid #ddd;
    }

    .chat-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #ddd;
      color: #222;
    }

    .chat-input button {
      background-color: #2c2c2c;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 8px 15px;
      margin-left: 5px;
      cursor: pointer;
    }

    .chat-input button:hover {
      background-color: #0056b3;
    }
    .hidden {
      display: none;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-widget': ChatWidget;
  }
}
