import { PiWorkerMessage, PiLegacyHostMessage, PiralEvent } from '../../types';
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

export function handleLegacyMessage(message: PiLegacyHostMessage) {
  if (message.type === 'init') {
    return initLegacyApi();
  } else if (!available) {
    clearTimeout(checkInterval);
    return;
  }

  switch (message.type) {
    case 'all-infos':
      return [
        handleLegacyMessage({
          type: 'get-events',
        }),
        handleLegacyMessage({
          type: 'get-settings',
        }),
        handleLegacyMessage({
          type: 'get-pilets',
        }),
        handleLegacyMessage({
          type: 'get-routes',
        }),
      ];
    case 'append-pilet':
      return appendPilet(message.meta);
    case 'remove-pilet':
      return removePilet(message.name);
    case 'toggle-pilet':
      return togglePilet(message.name);
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
    available = true;
    clearTimeout(checkInterval);
    setupEvents();
    sendMessage({
      ...e.detail,
      type: 'available',
    });
    listenToEvents();
    supervise();
    console.info('Piral Inspector connected!');
  });

  checkInterval = setInterval(check, 1000);
}
