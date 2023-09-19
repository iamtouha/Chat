import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('message-item')
export class MessageItem extends LitElement {
  @property({ type: Boolean }) sender = false;
  @property() content = '';
  @property() time = '';

  render() {
    return html`
      <div class="message-item ${this.sender ? 'sender' : ''}">
        <div class="message-content">${this.content}</div>
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'message-item': MessageItem;
  }
}
