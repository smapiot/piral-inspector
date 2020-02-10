import browser from 'webextension-polyfill';
import {
  check,
  supervise,
  runQuery,
  runCommand,
  getPilets,
  removePilet,
  appendPilet,
  getRoutes,
  gotoRoute,
} from './helpers';
import { PiWorkerMessage, PiHostMessage } from '../types';

let available: any = undefined;

const port = browser.runtime.connect({
  name: 'piral-inspector-worker',
});

function sendMessage(message: PiWorkerMessage) {
  port.postMessage({
    message,
    target: 'panel',
  });
}

function receiveMessage(message: PiHostMessage) {
  switch (message.type) {
    case 'check-available':
      return checkAvailable();
    case 'append-pilet':
      return appendPilet(message.meta);
    case 'remove-pilet':
      return removePilet(message.name);
    case 'get-pilets':
      return getPilets();
    case 'run-command':
      return runCommand(message.method, message.args);
    case 'run-query':
      return runQuery(message.id, message.value);
    case 'get-routes':
      return getRoutes();
    case 'goto-route':
      return gotoRoute(message.route);
  }
}

port.onMessage.addListener(receiveMessage);

function checkAvailable() {
  if (available) {
    sendMessage({
      ...available,
      type: 'available',
    });
  }
}

['result', 'pilets', 'routes'].forEach(type => {
  window.addEventListener(`piral-${type}`, (e: CustomEvent) => {
    sendMessage({
      ...e.detail,
      type,
    });
  });
});

window.addEventListener('piral-found', (e: CustomEvent) => {
  available = e.detail;
  checkAvailable();
  console.info('Piral Inspector connected!');
});

window.addEventListener('unload', () => {
  available = undefined;
  sendMessage({
    type: 'unavailable',
  });
});

check();
supervise();
