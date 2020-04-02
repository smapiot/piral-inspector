import { browser } from 'webextension-polyfill-ts';
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
  getSettings,
  setSettings,
  listenToEvents,
  sendEvent,
} from './helpers';
import { PiWorkerMessage, PiHostMessage, PiralEvent } from '../types';

let available: any = undefined;
const events: Array<PiralEvent> = [];

const port = browser.runtime.connect(undefined, {
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
    case 'get-events':
      return getEvents();
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
    case 'get-settings':
      return getSettings();
    case 'update-settings':
      return setSettings(message.settings);
    case 'emit-event':
      return sendEvent(message.name, message.args);
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

function getEvents() {
  sendMessage({
    events,
    type: 'events',
  });
}

['result', 'pilets', 'routes', 'settings'].forEach(type => {
  window.addEventListener(`piral-${type}`, (e: CustomEvent) => {
    sendMessage({
      ...e.detail,
      type,
    });
  });
});

window.addEventListener('piral-event', (e: CustomEvent) => {
  events.unshift({
    id: events.length.toString(),
    time: Date.now(),
    ...e.detail,
  });
  getEvents();
});

window.addEventListener('piral-found', (e: CustomEvent) => {
  clearTimeout(checkInterval);
  available = e.detail;
  checkAvailable();
  listenToEvents();
  supervise();
  console.info('Piral Inspector connected!');
});

window.addEventListener('unload', () => {
  available = undefined;
  sendMessage({
    type: 'unavailable',
  });
});

const checkInterval = setInterval(check, 1000);
