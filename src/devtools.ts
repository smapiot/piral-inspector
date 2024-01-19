import * as browser from 'webextension-polyfill';
import { useStore } from './app/store';
import type { PiWorkerMessage, PiHostMessage } from './types';

function initPanel() {
  return browser.devtools.panels.create('Piral', '/assets/logo.png', './panel.html');
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

  panel.onShown.addListener((panelWindow: Window) => {
    panelWindow.sendCommand = sendMessage;
    panelWindow.dispatchEvent(new CustomEvent('pi-store', { detail: useStore }));
  });

  port.onMessage.addListener((message: PiWorkerMessage) => {
    const { actions } = useStore.getState();

    switch (message.type) {
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
      case 'extensions':
        return actions.updateExtensions(message.extensions);
      case 'info':
        return actions.updateInfo(message.name, message.version, message.kind, message.capabilities);
      case 'dependency-map':
        return actions.updateDependencyMap(message.dependencyMap);
    }
  });

  sendMessage({ type: 'init' });
}

function logError(err: Error) {
  console.error('An unexpected error occured while setting up the panels.', err);
}

initPanel().then(connectPanel).catch(logError);
