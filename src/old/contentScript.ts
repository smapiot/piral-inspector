import * as browser from 'webextension-polyfill';
import { handleLegacyMessage } from './scripts/legacy-worker';
import type { PiralDebugApiMessage, PiralInspectorMessage } from './types';

/**
 * Disconnects the Piral Inspector.
 */
window.addEventListener('unload', () => {
  browser.runtime.sendMessage({
    type: 'unavailable',
  });
});

/**
 * Receives messages from the piral-debug-utils.js
 */
window.addEventListener('message', (event) => {
  if (event.source === window) {
    const message: PiralDebugApiMessage = event.data;

    if (typeof message === 'object' && message?.source === 'piral-debug-api') {
      const { content } = message;
      browser.runtime.sendMessage(content);

      if (content.type === 'available') {
        console.info(`Piral Inspector (${content.kind}) connected!`);
      }
    }
  }
});
 

/**
 * Receives messages from the background.js
 */
browser.runtime.onMessage.addListener((content) => {
  const message: PiralInspectorMessage = {
    content,
    source: 'piral-inspector',
    version: 'v1',
  };
  window.postMessage(message, '*');
  handleLegacyMessage(content);
});

/**
 * Tries to connect the instance to the dev tools.
 */
browser.runtime.sendMessage({
  type: 'cs-connect',
});
