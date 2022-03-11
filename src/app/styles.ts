import { css } from '@emotion/core';

export const connectedView = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1em;
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

  .btn-primary {
    margin-top: 10px;
  }
`;

export const footer = css`
  padding-top: 1em;
  font-size: 0.8rem;
  text-align: right;
`;

export const tabLink = css`
  > a:not(.active) {
    cursor: pointer;
  }
`;

export const appSectionView = css`
  margin-top: 1.5rem;
  display: flex;
  flex: 1;
  flex-direction: column;

  > p {
    margin-top: 1rem;
  }

  > * + h3 {
    margin-top: 1.5rem;
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

export const miniInfo = css`
  font-size: 0.8em;
`;

export const reactFlowContainer = css`
  flex: 1;
  display: flex;
`;

export const globalViewLight = css`
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .tab-content {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .tab-content > .active {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .css-68xmne-Content:last-child {
    flex: 1;
  }

  a > svg {
    fill: #777;
  }

  a:hover > svg {
    fill: #007bff;
  }

  .react-flow {
    flex: 1;
    position: relative;
    color: #ffffff;
    height: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .react-flow .controls {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
  }

  .react-flow__node-default {
    background: #ff6060;
    color: #ffff;
    font-size: 20px;
    width: 240px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-flow__node-input {
    background: #637c93;
    color: #ffff;
    font-size: 20px;
    border-color: #637c93;
    width: 240px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-flow__node-output {
    background: #4b11cb;
    color: #ffff;
    font-size: 20px;
    border-color: #4b11cb;
    width: 240px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-flow__edge-path {
    fill: none;
    stroke: #a79797;
    stroke-width: 2;
  }
`;

export const globalViewDark = css`
  html,
  body,
  #app {
    margin: 0;
    padding: 0;
    background-color: #2a2f3a;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .css-1wwuptt {
    height: 100%;
  }

  .tab-content {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .tab-content > .active {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .css-68xmne-Content:last-child {
    flex: 1;
  }

  .btn-primary {
    background: #6c757d;
    border: 1px solid #6c757d;
  }

  .btn-primary:hover {
    background: #6c757d;
    border: 1px solid #6c757d;
  }

  .btn-primary:disabled {
    background: #6c757d;
    border: 1px solid #6c757d;
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
    fill: #ffffff;
  }

  a:hover > svg {
    fill: #beaee2;
  }

  .list-group-item {
    background: rgb(60, 68, 79);
    color: #ffffff;
  }

  .list-group-item:hover {
    background: rgb(60, 68, 79);
    color: #ffffff;
  }

  .close {
    color: #ffffff;
  }

  .form-control {
    background: rgb(60, 68, 79);
    border: 1px solid rgb(60, 68, 79);
    color: #ffffff;
  }

  .form-control:focus {
    background: rgb(60, 68, 79);
    border: 1px solid rgb(60, 68, 79);
    color: #ffffff;
  }

  .custom-file-label {
    background: rgb(60, 68, 79);
    color: #ffffff;
  }

  .custom-file-label::placeholder {
    color: #ffffff;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: #8e5cff;
    background-color: #8e5cff;
  }

  .modal-content {
    background-color: rgb(60, 68, 79);
    color: #ffffff;
  }

  .list-group-item-heading {
    color: #ffffff;
  }

  .list-group-item-heading:hover {
    color: #ffffff;
  }

  .react-flow {
    flex: 1;
    position: relative;
    color: #ffffff;
    height: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .react-flow__node-default {
    background: #ff6060;
    color: #ffff;
    font-size: 20px;
    width: 240px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-flow__node-input {
    background: #637c93;
    color: #ffff;
    font-size: 20px;
    border-color: #637c93;
    width: 240px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-flow__node-output {
    background: #4b11cb;
    color: #ffff;
    font-size: 20px;
    border-color: #4b11cb;
    width: 240px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-flow__edge-path {
    fill: none;
    stroke: #ffffff;
    stroke-width: 2;
  }
`;

export const customSwitchStyle = css`
  margin-right: 2em;
`;
