import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('user-form')
export class UserForm extends LitElement {
  @property({ type: Boolean }) hidden = true;
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
      console.log(data);
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
    .form-wrapper.hidden {
      display: none;
    }
    .form-control {
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
    }
    input {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      background-color: #ddd;
      color: #222;
    }
    button {
      background-color: #2c2c2c;
      border: 0;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      width: 100%;
      height: 40px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'user-form': UserForm;
  }
}
