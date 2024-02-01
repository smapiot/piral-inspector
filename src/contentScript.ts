import { runtime } from 'webextension-polyfill';
import { PiralInspectorMessage } from './types';

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
  console.log('CONTENT SCRIPT ON MESSAGE', content)
});

/**
 * Tries to connect the instance to the dev tools.
 */
runtime.sendMessage({
  type: 'cs-connect',
});
