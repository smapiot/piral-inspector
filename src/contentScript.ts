import { runtime } from 'webextension-polyfill';
import { PiralInspectorMessage } from './types';

/**
 * Receives messages from the background.js
 */
runtime.onMessage.addListener((content) => {
  console.log('ON MESSAGE CONTENT SCRIPT', content);
  const message: PiralInspectorMessage = {
    content,
    source: 'piral-inspector',
    version: 'v1',
  };
  window.postMessage(message, '*');
});

/**
 * Tries to connect the instance to the dev tools.
 */
runtime.sendMessage({
  type: 'cs-connect',
});
