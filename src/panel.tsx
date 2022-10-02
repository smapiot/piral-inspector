import 'bootstrap/dist/css/bootstrap.min.css';
import { render } from 'react-dom';
import { jsx } from '@emotion/core';
import { App } from './app';

if (/Chrome/.test(navigator.userAgent)) {
  document.body.classList.add('is-chrome');
}

const app = document.querySelector('#app');
render(<App />, app);
