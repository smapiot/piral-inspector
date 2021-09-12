import { browser, Runtime } from 'webextension-polyfill-ts';

// Stores the connections from devtools.js
const tabPorts: Record<number, Runtime.Port> = {};

function setIconAndPopup(type: 'disabled' | 'production' | 'development', tabId: number) {
  browser.browserAction.setIcon({
    tabId,
    path: {
      '16': `assets/${type}_16.png`,
      '32': `assets/${type}_32.png`,
      '48': `assets/${type}_48.png`,
      '64': `assets/${type}_64.png`,
      '96': `assets/${type}_96.png`,
      '128': `assets/${type}_128.png`,
    },
  });

  browser.browserAction.setPopup({
    tabId,
    popup: `popups/${type}.html`,
  });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'loading') {
    const port = tabPorts[tabId];

    if (typeof port?.postMessage === 'function') {
      port.postMessage({ type: 'unavailable' });
      setIconAndPopup('disabled', tabId);
    }
  }
});

/**
 * From contentScript.js to background.js (and maybe to devtools.js)
 *            s -------------------> o -------------------> t
 */
browser.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id;

  if (tabId) {
    // Find related port (devtools.js)
    const port = tabPorts[sender.tab.id];

    if (message.type === 'available') {
      const type = message.mode === 'production' ? 'production' : 'development';
      setIconAndPopup(type, tabId);
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
