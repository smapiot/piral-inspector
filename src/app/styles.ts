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

export const tabLink = css`
  > a:not(.active) {
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    a.nav-link {
      color: #BEAEE2;
    }
  }
`;

export const showRoute = css`
  @media (prefers-color-scheme: dark) {
    .list-group-item-action {
      color: #BEAEE2;
    }
  }
` 

export const stateContainer = css`
  @media (prefers-color-scheme: dark) {
    .stateContainer__a {
      color: #afafaf;
    }
  }
`;

export const extensionCatalogue = css`
  @media (prefers-color-scheme: dark) {
    .list-group-item {
      background: hsl(0, 0%, 14%);
      color: #afafaf;
    }
  }
`

export const appSectionView = css`
  margin-top: 1.5em;

  @media (prefers-color-scheme: dark) {
    .list-group-item {
      background: hsl(0, 0%, 14%);
      color: #afafaf;
    }

    .modal-content {
      background-color: #292a2b;
      color: #afafaf;
    }
  
    .close {
      color: #afafaf;
    }
  
    .form-control {
      background: hsl(0, 0%, 14%);
      border:1px solid hsl(0, 0%, 14%);
      color: #afafaf;
    }
   
    .custom-file-label {
      background: hsl(0, 0%, 14%);
    }
    
    .custom-file-label::placeholder {
      color: #6c757d;
    }

    .custom-control-input:checked~.custom-control-label::before {
      border-color: #8e5cff;
      background-color: #8e5cff;
    }

    .list-group-item-heading {
      color: #afafaf;
    }
  }

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

  @media (prefers-color-scheme: dark) {
    a:hover > svg {
      fill: #BEAEE2;
    }
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
    body {
      background-color: #292a2b;
      color: #afafaf;

      .modal, .list-group {
        color: black;
      }
    }
  }

`;

export const customSwitchStyle = css`
  margin-right: 2em;
`;
