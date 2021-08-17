import { PiWorkerMessage, PiHostMessage, PiralEvent } from '../../types';
import {
  check,
  supervise,
  removePilet,
  appendPilet,
  gotoRoute,
  setSettings,
  listenToEvents,
  sendEvent,
  togglePilet,
  sendVisualizeAll,
} from './helpers';

const events: Array<PiralEvent> = [];
let available = false;
let checkInterval: NodeJS.Timeout;

function sendMessage(message: PiWorkerMessage) {
  const envelope = {
    version: 'v1',
    source: 'piral-debug-api',
    content: message,
  };
  window.postMessage(envelope, '*');
}

export function handleLegacyMessage(message: PiHostMessage) {
  if (message.type === 'init') {
    return initLegacyApi();
  } else if (!available) {
    clearTimeout(checkInterval);
    return;
  }

  switch (message.type) {
    case 'append-pilet':
      return appendPilet(message.meta);
    case 'remove-pilet':
      return removePilet(message.name);
    case 'toggle-pilet':
      return togglePilet(message.name);
    case 'goto-route':
      return gotoRoute(message.route);
    case 'update-settings':
      return setSettings(message.settings);
    case 'emit-event':
      return sendEvent(message.name, message.args);
    case 'visualize-all':
      return sendVisualizeAll();
  }
}

function getEvents() {
  sendMessage({
    events,
    type: 'events',
  });
}

function setupEvents() {
  ['result', 'pilets', 'routes', 'settings', 'container'].forEach(type => {
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
}

export function initLegacyApi() {
  window.addEventListener('piral-found', (e: CustomEvent) => {
    clearTimeout(checkInterval);

    if (e.detail.kind === 'v0') {
      available = true;
      setupEvents();
      sendMessage({
        ...e.detail,
        state: {
          ...e.detail.state,
          events,
        },
        type: 'available',
      });
      listenToEvents();
      supervise();
      console.info('Piral Inspector connected!');
    }
  });

  checkInterval = setInterval(check, 1000);
}
