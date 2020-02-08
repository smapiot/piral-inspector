import browser from 'webextension-polyfill';
import { PiWorkerMessage, PiHostMessage } from '../types';

let available = false;

const port = browser.runtime.connect({
  name: 'piral-inspector-worker',
});

function sendMessage(message: PiWorkerMessage) {
  port.postMessage({
    message,
    target: 'panel',
  });
}

function receiveMessage(message: PiHostMessage) {
  switch (message.type) {
    case 'is-available':
      return checkAvailable();
  }
}

port.onMessage.addListener(receiveMessage);

function checkDebugMode() {
  if ('dbg:piral' in window) {
    const ev = new CustomEvent('piral-found');
    window.dispatchEvent(ev);
  }
}

function checkAvailable() {
  if (available) {
    sendMessage({
      type: 'available',
    });
  }
}

function injectScript(content: () => void) {
  const script = document.createElement('script');
  script.textContent = `(${content.toString()})()`;
  document.head.appendChild(script);
  script.remove();
}

window.addEventListener('piral-found', () => {
  available = true;
  checkAvailable();
  console.info('Piral Inspector connected!');
});

window.addEventListener('unload', () => {
  sendMessage({
    type: 'unavailable',
  });
});

injectScript(checkDebugMode);
