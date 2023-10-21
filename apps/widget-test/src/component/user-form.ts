import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from './styles';

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
        <button type="submit">
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
      }
      .form-wrapper label {
        color: var(--im-foreground);
      }
      .form-control {
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
      }
      input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: var(--im-secondary);
        color: var(--im-secondary-foreground);
      }
      button {
        background-color: var(--im-primary);
        border: 0;
        border-radius: 4px;
        color: var(--im-primary-foreground);
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
