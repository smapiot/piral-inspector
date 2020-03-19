import 'bootstrap/dist/css/bootstrap.min.css';
import { render } from 'react-dom';
import { jsx } from '@emotion/core';
import { App } from './App';

const app = document.querySelector('#app');
render(<App />, app);
