import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { downloadIcon } from '../lib/icons';
import { baseStyles } from '../lib/styles';

@customElement('message-item')
export class MessageItem extends LitElement {
  @property({ type: Boolean }) sender = false;
  @property() content = '';
  @property() time = '';
  @property({ type: String }) contentType = 'TEXT';
  @property({ type: Boolean }) local = false;
  @property({ type: Boolean }) showTime = false;

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
        <div class="message-time ${this.showTime ? '' : 'hidden'}">
          ${this.time}
        </div>
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

  static styles = [
    baseStyles,
    css`
      .message-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        transform: translateZ(0);
      }
      .message-item.sender {
        align-items: flex-end;
      }
      .message-content {
        padding: 8px 10px;
        border-radius: var(--im-chat-border-radius);
        background-color: var(--im-receiveditem-color);
        color: var(--im-receiveditem-text-color);
      }
      .message-item.sender .message-content {
        background-color: var(--im-sentitem-color);
        color: var(--im-sentitem-text-color);
      }
      .message-time {
        font-size: 12px;
        color: var(--im-muted-text-color);
        padding-left: 5px;
      }
      .message-item.sender .message-time {
        text-align: right;
        padding-right: 5px;
      }
      .received-img {
        max-width: 200px;
        max-height: 200px;
        height: 100%;
        border-radius: var(--im-app-border-radius);
        border: 1px solid var(--im-muted-text-color);
      }

      .download-btn {
        margin-left: 10px;
        text-decoration: none;
        color: var(--im-receiveditem-text-color);
      }
      .sender .download-btn {
        color: var(--im-sentitem-text-color);
      }
      .download-btn svg {
        width: 16px;
        height: 16px;
      }
      @media (min-width: 760px) {
        .full .received-img {
          max-width: 350px;
          max-height: 350px;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'message-item': MessageItem;
  }
}
