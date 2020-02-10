import { css } from "@emotion/core";

export const connectedView = css`
  display: flex;
  margin: 1em;
  flex-direction: column;
`;

export const piletListView = css`
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;

  > li {
    margin: 0.3em 0;
    padding: 0;
  }
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
  }
`;
