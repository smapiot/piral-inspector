import { browser } from 'webextension-polyfill-ts';
import { handleLegacyMessage } from './legacy/worker';
import { PiralDebugApiMessage, PiralInspectorMessage } from '../types';

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
window.addEventListener('message', event => {
  if (event.source === window) {
    const message: PiralDebugApiMessage = event.data;

    if (typeof message === 'object' && message?.source === 'piral-debug-api') {
      browser.runtime.sendMessage(message.content);
    }
  }
});

/**
 * Receives messages from the background.js
 */
browser.runtime.onMessage.addListener(content => {
  const message: PiralInspectorMessage = {
    content,
    source: 'piral-inspector',
    version: 'v1',
  };
  window.postMessage(message, '*');
  handleLegacyMessage(content);
});

browser.runtime.sendMessage({
  type: 'cs-connect',
});
