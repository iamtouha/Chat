import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { baseStyles } from '../lib/styles';
import dayjs from 'dayjs';
import socket from '../lib/socket';
import { addImageIcon, closeIcon, fileIcon, sendIcon } from '../lib/icons';
import type {
  Conversation,
  FileData,
  Message,
  ResponsePayload,
} from '../types';
import { serverUrl } from '../variables';

import './user-form';
import './message-item';

@customElement('chat-component')
export class ChatComponent extends LitElement {
  @property({ type: String }) apikey = '';
  @property({ type: Boolean, reflect: true }) muted = false;
  @state() private _conversationid = '';
  @state() private _conversationLoading = false;
  @state() private _messages: Message[] = [];
  @state() private _selectedFile: File | null = null;

  render() {
    return html`
      <user-form
        ?hidden="${!!this._conversationid.length}"
        ?loading="${this._conversationLoading}"
      ></user-form>
      <div class="chat-wrapper">
        <div class="chat-box ${this._conversationid ? '' : 'hidden'}">
          ${this._messages.map(
            (message, i) => html`
              <message-item
                ?sender="${message.type === 'OUTBOUND'}"
                content="${message.content}"
                contentType="${message.contentType}"
                ?local="${message.local}"
                time="${dayjs(message.createdAt).format('hh:mm A')}"
                ?showTime="${this._showChatTime(i)}"
              ></message-item>
            `,
          )}
        </div>
        <div class="chat-input ${this._conversationid ? '' : 'hidden'}">
          <input
            type="file"
            id="fileInput"
            accept=".png, .jpeg, .pdf, .docx, .csv, .xlsm"
            class="hidden"
            @change="${this._handleFileSelect}"
          />
          <button class="attach-btn" @click=${this._openFileInput}>
            ${this._selectedFile ? closeIcon : addImageIcon}
          </button>
          ${this._selectedFile
            ? html`<div class="file-preview">
                ${this._selectedFile.type.startsWith('image/')
                  ? html`<img
                      src="${URL.createObjectURL(this._selectedFile)}"
                    />`
                  : html`
                      <span style="width:24px; height:24px; display:block;"
                        >${fileIcon}</span
                      >
                    `}
                <p class="filename">${this._selectedFile.name}</p>
              </div>`
            : null}
          <input
            class="message-input ${this._selectedFile?.name ? 'hidden' : ''}"
            type="text"
            id="messageBox"
            placeholder="Type your message..."
          />
          <button class="send-btn" @click="${this._writeMessage}">
            ${sendIcon}
          </button>
        </div>
      </div>
      <audio id="alertAudio" class="hidden">
        <source src="${serverUrl}/assets/ding.m4a" />
      </audio>
    `;
  }

  _showChatTime = (index: number) => {
    const message = this._messages[index];
    if (!message) return false;
    const prevMessage = this._messages[index - 1];
    if (!prevMessage) return true;
    return dayjs(prevMessage.createdAt).diff(message.createdAt, 'minute') > 5;
  };

  _openFileInput = () => {
    if (this._selectedFile) {
      this._selectedFile = null;
      return;
    }
    const fileInput = this.shadowRoot?.getElementById(
      'fileInput',
    ) as HTMLInputElement;
    if (!fileInput) return;
    fileInput.click();
  };

  _handleFileSelect = () => {
    const fileInput = this.shadowRoot?.getElementById(
      'fileInput',
    ) as HTMLInputElement;
    if (!fileInput) return;
    const file = fileInput.files?.[0];
    if (!file || file.size > 1024 * 1024 * 2) return;
    this._selectedFile = file;
    fileInput.value = '';
  };

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    super.requestUpdate(name, oldValue);

    if (name === '_conversationid' && this._conversationid) {
      this._fetchConversation();
      socket.emit('user_connected', this._conversationid, this.apikey);
      socket.on('message_received', (message: Message) => {
        this._messages = [message, ...this._messages];
        if (this.muted) return;
        const audio = this.shadowRoot?.getElementById(
          'alertAudio',
        ) as HTMLAudioElement;
        audio?.play();
      });
      socket.on('message_updated', (message: Message, localId: string) => {
        this._messages = this._messages.map((msg) =>
          msg.id === localId ? message : msg,
        );
      });
    }
    // if (name === '_messages') {
    //   const chatBox = this.shadowRoot?.querySelector('.chat-box');
    //   if (!chatBox) return;
    //   setTimeout(() => {
    //     chatBox.scrollTop = chatBox.scrollHeight;
    //   }, 1);
    // }
  }
  connectedCallback() {
    super.connectedCallback();
    socket.on('connect', () => {
      console.log('connected');
    });
    const conversationid = localStorage.getItem('conversationid');
    if (conversationid) {
      this._conversationid = conversationid;
    }
    this.addEventListener('user-form-submit', async (e) => {
      const data = (e as CustomEvent).detail;
      await this._createConversation(data);
    });
  }

  _uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', this._selectedFile as Blob);
    formData.append('apiKey', this.apikey);
    const response = await fetch(`${serverUrl}/api/v1/files/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) return;
    const data = (await response.json()) as ResponsePayload<FileData>;
    if (data?.status !== 'success') return;
    return data.result;
  };

  _writeMessage = async () => {
    const messageInput = this.shadowRoot?.getElementById(
      'messageBox',
    ) as HTMLInputElement;
    if (!this._conversationid) {
      console.error('No conversation id');
      return;
    }
    if (!messageInput?.value && !this._selectedFile) {
      console.error('No message to send');
      return;
    }

    const contentType = this._selectedFile?.type.startsWith('image/')
      ? 'IMAGE'
      : this._selectedFile
      ? 'FILE'
      : 'TEXT';
    const url = this._selectedFile
      ? URL.createObjectURL(this._selectedFile)
      : null;

    const localId = Date.now().toString();
    const newMessage: Message = {
      id: localId,
      content: url ?? messageInput.value,
      type: 'OUTBOUND',
      contentType: contentType,
      seen: false,
      local: true,
      createdAt: new Date().toJSON(),
      conversationId: this._conversationid,
    };
    this._messages = [newMessage, ...this._messages];
    messageInput.value = '';
    socket.emit('message_sent', newMessage, this.apikey);

    const filedata = this._selectedFile ? await this._uploadFile() : null;
    this._selectedFile = null;

    const response = await fetch(`${serverUrl}/api/v1/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: filedata?.location ?? newMessage.content,
        type: newMessage.type,
        conversationId: newMessage.conversationId,
        contentType: newMessage.contentType,
        fileId: filedata?.id,
      }),
    });
    if (!response.ok) {
      this._messages = this._messages.filter(
        (message) => message.id !== newMessage.id,
      );
      return;
    }
    const data = (await response.json()) as ResponsePayload<Message>;
    if (data?.status !== 'success') {
      this._messages = this._messages.filter(
        (message) => message.id !== newMessage.id,
      );
      return;
    }
    this._messages = this._messages.map((message) =>
      message.id === localId ? data.result : message,
    );
    socket.emit('message_update_sent', data.result, localId);
  };

  _createConversation = async (info: { name: string; email: string }) => {
    this._conversationLoading = true;
    const response = await fetch(`${serverUrl}/api/v1/conversations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...info, apiKey: this.apikey }),
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
    socket.emit('conversation_started', data.result, this.apikey);
    localStorage.setItem('conversationid', this._conversationid);
  };

  _fetchConversation = async () => {
    if (!this._conversationid) return;
    const response = await fetch(
      `${serverUrl}/api/v1/conversations/${this._conversationid}`,
    );

    if (!response.ok) {
      this._conversationid = '';
      localStorage.removeItem('conversationid');
      return;
    }
    const data = await response.json();
    const conv = data.result as Conversation & { messages: Message[] };
    this._messages = conv.messages;
  };

  static styles = [
    baseStyles,
    css`
      .chat-wrapper {
        position: relative;
        width: 100%;
        height: calc(100% - 50px);
        display: grid;
        grid-template-rows: 1fr 55px;
        color: var(--im-text-color);
        container-type: inline-size;
      }
      .chat-box {
        padding: 10px;
        overflow-y: scroll;
        display: flex;
        flex-direction: column-reverse;
        gap: 5px;
      }
      .chat-input {
        max-width: 100%;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        padding: 10px;
        background-color: var(--im-primary-color);
        color: var(--im-primary-text-color);
        box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
      }
      .chat-input.hidden {
        display: none;
      }
      .chat-input input {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--im-muted-text-color);
        border-radius: var(--im-app-border-radius);
        background-color: var(--im-background-color);
        color: var(--im-text-color);
      }
      .send-btn {
        background-color: var(--im-send-btn-color);
        color: var(--im-send-btn-text-color);
        line-height: 0;
        border: none;
        border-radius: var(--im-app-border-radius);
        padding: 6px 10px;
        margin-left: 5px;
        cursor: pointer;
      }
      .send-btn svg {
        width: 22px;
        height: 22px;
      }
      .attach-btn {
        border: none;
        background-color: transparent;
        color: var(--im-primary-text-color);
        border-radius: var(--im-app-border-radius);
        line-height: 0;
        padding: 8px;
        margin-right: 5px;
        cursor: pointer;
      }
      .attach-btn svg {
        width: 21px;
        height: 21px;
      }
      .file-preview {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .file-preview img {
        width: 30px;
        height: 30px;
        object-fit: contain;
        border-radius: var(--im-app-border-radius);
      }
      .filename {
        line-height: 1;
        font-size: small;
        width: 185px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      @container (min-width: 600px) {
        .filename {
          width: calc(100% - 140px);
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-component': ChatComponent;
  }
}
