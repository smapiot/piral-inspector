import { browser } from 'webextension-polyfill-ts';
import { store } from './app/store';
import { PiWorkerMessage, PiHostMessage } from './types';

function initPanel() {
  return browser.devtools.panels.create('Piral', '/assets/logo.png', './app/index.html');
}

function connectPanel(panel: any) {
  const port = browser.runtime.connect(undefined, { name: 'piral-inspector-host' });

  const sendMessage = (message: PiHostMessage) => {
    const tabId = browser.devtools.inspectedWindow.tabId;
    port.postMessage({
      message,
      tabId,
    });
  };

  const init = () => sendMessage({ type: 'init' });

  panel.onShown.addListener((panelWindow: Window) => {
    panelWindow.sendCommand = sendMessage;
    panelWindow.dispatchEvent(new CustomEvent('pi-store', { detail: store }));
  });

  port.onMessage.addListener((message: PiWorkerMessage) => {
    const [_, api] = store;
    const { actions } = api.getState();

    switch (message.type) {
      case 'cs-connect':
        return init();
      case 'available':
        return actions.connect(message.name, message.version, message.kind, message.capabilities, message.state);
      case 'unavailable':
        return actions.disconnect();
      case 'pilets':
        return actions.updatePilets(message.pilets);
      case 'routes':
        return actions.updateRoutes(message.routes);
      case 'settings':
        return actions.updateSettings(message.settings);
      case 'container':
        return actions.updateContainer(message.container);
      case 'events':
        return actions.updateEvents(message.events);
    }
  });

  init();
}

function logError(err: Error) {
  console.error('An unexpected error occured while setting up the panels.', err);
}

initPanel()
  .then(connectPanel)
  .catch(logError);
