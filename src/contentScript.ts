import { runtime } from 'webextension-polyfill';
import { PiralDebugApiMessage, PiralInspectorMessage } from './types';
import { handleLegacyMessage } from './scripts/legacy-worker';

const handleMessage = (message: PiralDebugApiMessage) => {
  if (typeof message === 'object' && message?.source === 'piral-debug-api') {
    const { content } = message;
    runtime.sendMessage(content);

    if (content.type === 'available') {
      console.info(`Piral Inspector (${content.kind}) connected!`);
    }
  }
};
/**
 * Disconnects the Piral Inspector.
 */
window.addEventListener('unload', () => {
  runtime.sendMessage({
    type: 'unavailable',
  });
});

/**
 * Receives messages from the piral-debug-utils.js and forwards it to service worker
 */
window.addEventListener('message', (event) => {
  if (event.source === window) {
    const message: PiralDebugApiMessage = event.data;
    handleMessage(message);
  }
});

/**
 * Receives messages from the service worker.js
 */
runtime.onMessage.addListener((content) => {
  const message: PiralInspectorMessage = {
    content,
    source: 'piral-inspector',
    version: 'v1',
  };
  window.postMessage(message, '*');
  //handleLegacyMessage(content)
});

/**
 * Tries to connect the instance to the dev tools.
 */
runtime.sendMessage({
  type: 'cs-connect',
});
