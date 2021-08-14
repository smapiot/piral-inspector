import { browser, Runtime } from 'webextension-polyfill-ts';

// Stores the connections from devtools.js
const tabPorts: Record<number, Runtime.Port> = {};

/**
 * From contentScript.js to background.js (and maybe to devtools.js)
 *            s -------------------> o -------------------> t
 */
browser.runtime.onMessage.addListener((message, sender) => {
  // Find related port (devtools.js)
  const port = sender.tab?.id && tabPorts[sender.tab.id];

  // Only send back to devtools.js if connection still available
  if (typeof port?.postMessage === 'function') {
    port.postMessage(message);
  }
});

/**
 * From devtools.js to background.js (and maybe to contentScript.js)
 *            s -------------------> o -------------------> t
 */
browser.runtime.onConnect.addListener((port: Runtime.Port) => {
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
        browser.tabs.sendMessage(tabId, message);
      }
    };

    port.onMessage.addListener(handler);

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(handler);
      delete tabPorts[tabId];
    });
  }
});
