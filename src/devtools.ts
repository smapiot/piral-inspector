import browser from 'webextension-polyfill';
import { PiWorkerMessage, PiHostMessage } from './types';

function initPanel() {
  return browser.devtools.panels.create('Piral', '/assets/logo.png', './app/index.html');
}

function connectPanel(panel: any) {
  let port = undefined;

  const sendMessage = (message: PiHostMessage) => {
    const tabId = browser.devtools.inspectedWindow.tabId;
    port.postMessage({
      message,
      tabId,
    });
  };

  panel.onShown.addListener((panelWindow: Window) => {
    port = browser.runtime.connect({ name: 'piral-inspector-host' });
    port.onMessage.addListener((message: PiWorkerMessage) => {
      const e = new CustomEvent<PiWorkerMessage>('pi-recv-response', {
        detail: message,
      });
      panelWindow.dispatchEvent(e);
    });

    panelWindow.addEventListener('pi-send-request', (e: CustomEvent) => {
      sendMessage(e.detail);
    });

    sendMessage({
      type: 'check-available',
    });
  });

  panel.onHidden.addListener(() => {
    port.disconnect();
    port = undefined;
  });
}

function logError(err: Error) {
  console.error('An unexpected error occured while setting up the panels.', err);
}

initPanel()
  .then(connectPanel)
  .catch(logError);
