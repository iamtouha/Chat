import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../lib/styles';

@customElement('user-form')
export class UserForm extends LitElement {
  @property({ type: Boolean }) hidden = false;
  @property({ type: Boolean }) loading = false;

  render() {
    return html`<div class="form-wrapper ${this.hidden ? 'hidden' : ''}">
      <p>
        Please provide the following information before starting the
        conversation:
      </p>
      <form @submit="${this._onSubmit}">
        <div class="form-control">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" />
        </div>
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <button class="submit-btn" type="submit">
          ${this.loading ? 'Starting Conversation...' : 'Start Conversation'}
        </button>
      </form>
    </div>`;
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
      .form-wrapper {
        padding: 10px;
        margin-top: 30px;
      }
      .form-control {
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
      }
      .form-control label {
        color: var(--im-text-color);
        margin-bottom: 5px;
        margin-top: 10px;
      }
      .form-control input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: var(--im-app-border-radius);
        border: 1px solid var(--im-muted-text-color);
        background-color: var(--im-input-color);
        color: var(--im-input-text-color);
      }
      .submit-btn {
        margin-top: 20px;
        background-color: var(im-send-btn-color);
        border: 0;
        border-radius: 4px;
        color: var(--im-send-btn-text-color);
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        width: 100%;
        height: 40px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'user-form': UserForm;
  }
}
