import { css } from "@emotion/core";

export const connectedView = css`
  display: flex;
  margin: 1em;
  flex-direction: column;
`;

export const notConnectedView = css`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;

  > p {
    font-size: 0.9em;
    margin: 0.5em 0;
    width: 80%;
    text-align: center;
  }
`;

export const appSectionView = css`
  margin-top: 1.5em;

  > p {
    margin-top: 1em;
  }
`;

export const basicInfoView = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  h2 {
    flex: 1;
  }

  a {
    padding: 1em;
  }

  a > svg {
    fill: #777;
  }

  a:hover > svg {
    fill: #007bff;
  }
`;

export const globalView = css`
  html, body, #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  @media (prefers-color-scheme: dark) {
    body.is-chrome {
      background-color: #000;
      color: white;
    }
  }
`;
