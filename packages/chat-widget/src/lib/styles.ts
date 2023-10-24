import { css } from 'lit';

export const baseStyles = css`
  :host {
    box-sizing: border-box;
    font-family: sans-serif;
    color: var(--im-text-color);
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .hidden {
    display: none;
  }
`;
