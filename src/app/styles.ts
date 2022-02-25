import { css } from '@emotion/core';

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
`;

export const globalViewLight = css`
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  a > svg {
    fill: #777;
  }

  a:hover > svg {
    fill: #007bff;
  }

  .btn-secondary {
    background: #007bff;
  }

  .btn-secondary:hover {
    background: #007bff;
  }

  .btn-secondary:disabled {
    background: #007bff;
  }
`;

export const globalViewDark = css`
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #292a2b;
    color: #afafaf;
  }

  .nav-link {
    color: #beaee2;
  }

  .nav-link:hover {
    color: #beaee2;
  }

  .breadcrumb-item a {
    color: #611cfb;
  }

  a > svg {
    fill: #777;
  }

  a:hover > svg {
    fill: #beaee2;
  }

  .list-group-item {
    background: hsl(0, 0%, 14%);
    color: #afafaf;
  }

  .close {
    color: #afafaf;
  }

  .form-control {
    background: hsl(0, 0%, 14%);
    border: 1px solid hsl(0, 0%, 14%);
    color: #afafaf;
  }

  .form-control:focus {
    background: hsl(0, 0%, 14%);
    border: 1px solid hsl(0, 0%, 14%);
    color: #afafaf;
  }

  .custom-file-label {
    background: hsl(0, 0%, 14%);
  }

  .custom-file-label::placeholder {
    color: #6c757d;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: #8e5cff;
    background-color: #8e5cff;
  }

  .modal-content {
    background-color: #292a2b;
    color: #afafaf;
  }

  .list-group-item-heading {
    color: #afafaf;
  }

  .list-group-item-heading:hover {
    color: #afafaf;
  }
`;

export const customSwitchStyle = css`
  margin-right: 2em;
`;
