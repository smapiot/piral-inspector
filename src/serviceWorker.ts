import { Runtime, runtime, tabs } from 'webextension-polyfill';
import { setIconAndPopup } from './icons';

const tabPorts: Record<number, Runtime.Port> = {};

/**
 * From contentScript.js to background.js (and maybe to devtools.js)
 *            s -------------------> o -------------------> t
 */
runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id;

  if (!tabId) return;

  if (message.type === 'available') {
    const type = message.mode === 'production' ? 'production' : 'development';
    setIconAndPopup(type, tabId);
  }

  if (message.type === 'cs-connect') {
    tabs.sendMessage(sender.tab?.id, { type: 'init' });
  }

  const port = tabPorts[sender.tab.id];

  // Only send back to devtools.js if connection still available
  if (port && typeof port?.postMessage === 'function') {
    port.postMessage(message);
  }
});

/**
 * From devtools.js to background.js (and maybe to contentScript.js)
 *            s -------------------> o -------------------> t
 */
runtime.onConnect.addListener((port) => {
  if (port.name !== 'piral-inspector-host') {
    return;
  }

  /**
   * Keep alive ping to counteract v3 30s inactivity for service worker.
   * We do something every 10s.
   */
  const intervalId = setInterval(runtime.getPlatformInfo, 10_000);

  let tabId: number;

  const handler = async (ev: any) => {
    const message = ev.message;

    if (!message) {
      return;
    }

    if (message.type === 'init') {
      // handle initialize message to connect contentScript.js with devtools.js
      if (tabId === undefined) {
        tabId = ev.tabId;
        tabPorts[tabId] = port;
      }
    }

    if (tabId) {
      // forward message to the contentScript.js
      tabs.sendMessage(tabId, message);
    }
  };

  port.onMessage.addListener(handler);

  port.onDisconnect.addListener(() => {
    clearInterval(intervalId);
    port.onMessage.removeListener(handler);
    delete tabPorts[tabId];
  });
});
