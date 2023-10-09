import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { downloadIcon } from './icons';

@customElement('message-item')
export class MessageItem extends LitElement {
  @property({ type: Boolean }) sender = false;
  @property() content = '';
  @property() time = '';
  @property({ type: String }) contentType = 'TEXT';
  @property({ type: Boolean }) local = false;

  get name() {
    if (this.contentType !== 'FILE') return '';
    const key = this.content.split('/').pop()?.split('-');
    if (!key) return '';
    const [_, ...name] = key;
    return name.join('-').replace(/%20/g, ' ');
  }

  render() {
    return html`
      <div class="message-item ${this.sender ? 'sender' : ''}">
        ${this.contentType === 'TEXT'
          ? html`<div class="message-content">${this.content}</div>`
          : this.contentType === 'IMAGE'
          ? this.local
            ? html`<div class="message-content">
                You ${this.sender ? 'sent' : 'received'} an image
              </div>`
            : html`<img src="${this.content}" class="received-img" />`
          : html`<div class="message-content">
              ${this.local
                ? `you ${this.sender ? 'sent' : 'received'} a file`
                : html`${this.name}
                    <a
                      href="${this.content}"
                      class="download-btn"
                      target="_blank"
                      >${downloadIcon}</a
                    > `}
            </div>`}
        <div class="message-time">${this.time}</div>
      </div>
    `;
  }

  _onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    if (data.name && data.email) {
      this.dispatchEvent(
        new CustomEvent('user-form-submit', {
          detail: data,
          composed: true,
          bubbles: true,
        }),
      );
    }
  };

  static styles = css`
    :host {
      box-sizing: border-box;
      font-family: sans-serif;
      margin: 0;
      padding: 0;
      color: #2c2c2c;
    }
    .message-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 5px;
    }
    .message-item.sender {
      align-items: flex-end;
    }
    .message-content {
      padding: 8px 10px;
      border-radius: 10px;
      background-color: #eee;
    }
    .message-item.sender .message-content {
      background-color: #2c2c2c;
      color: #fff;
    }
    .message-time {
      font-size: 12px;
      color: #aaa;
    }
    .message-item.sender .message-time {
      text-align: right;
    }
    .received-img {
      max-width: 200px;
      max-height: 200px;
      height: 100%;
      border-radius: 5px;
      border: 1px solid #eee;
    }
    .download-btn {
      margin-left: 10px;
      color: #2c2c2c;
      text-decoration: none;
    }
    .download-btn svg {
      width: 16px;
      height: 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'message-item': MessageItem;
  }
}
