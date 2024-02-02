import { runtime } from 'webextension-polyfill';
import { PiralDebugApiMessage, PiralInspectorMessage } from './types';

/**
 * window is marked as @deprecated in v3 but is still the official way to access external applications
 * https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts?hl=en#host-page-communication
 */



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
runtime.onMessage.addListener((content, sender) => {
  const message: PiralInspectorMessage = {
    content,
    source: 'piral-inspector',
    version: 'v1',
  };
  window.postMessage(message, '*');

  //@todo check if somehow inline script can work in v3
  //handleLegacyMessage(content);
});

/**
 * Tries to connect the instance to the dev tools.
 */
runtime.sendMessage({
  type: 'cs-connect',
});
