import { runtime, webNavigation, storage, scripting, tabs, Runtime } from 'webextension-polyfill';
import { setIconAndPopup } from '../scripts/icons';

console.log('HELLO FROM THE SERVICE WORKER');
// Stores the connections from devtools.js
const tabPorts: Record<number, Runtime.Port> = {};

// Could be used to disitnguish / improve behavior in Firefox
const isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;

/**
 * From contentScript.js to background.js (and maybe to devtools.js)
 *            s -------------------> o -------------------> t
 */
runtime.onMessage.addListener((message, sender) => {
  console.log('ON MESSAGE');

  const tabId = sender.tab?.id;

  if (tabId) {
    // Find related port (devtools.js)
    const port = tabPorts[sender.tab.id];

    if (message.type === 'available') {
      const type = message.mode === 'production' ? 'production' : 'development';
      setIconAndPopup(type, tabId);
    } else if (message.type === 'cs-connect') {
      tabs.sendMessage(tabId, { type: 'init' });
    }

    // Only send back to devtools.js if connection still available
    if (typeof port?.postMessage === 'function') {
      port.postMessage(message);
    }
  }
});

/**
 * From devtools.js to background.js (and maybe to contentScript.js)
 *            s -------------------> o -------------------> t
 */
runtime.onConnect.addListener((port: Runtime.Port) => {
  // Only care about if the host was connected
  if (port.name === 'piral-inspector-host') {
    let tabId: number;

    const handler = (ev: any) => {
      const message = ev.message;

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
      port.onMessage.removeListener(handler);
      delete tabPorts[tabId];
    });
  }
});