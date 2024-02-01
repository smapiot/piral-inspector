import { Runtime, runtime, scripting, storage, tabs } from 'webextension-polyfill';

const tabPorts: Record<number, Runtime.Port> = {};

runtime.onMessage.addListener(async function (message, sender) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');

  const tabId = sender.tab?.id;

  if (!tabId) return;

  if (message.type === 'available') {
    const type = message.mode === 'production' ? 'production' : 'development';
    //setIconAndPopup(type, tabId);
  }

  if (message.type === 'cs-connect') {
    tabs.sendMessage(sender.tab?.id, { type: 'init' });
  }

  const port = tabPorts[sender.tab.id];

  // Only send back to devtools.js if connection still available
  if (port && typeof port?.postMessage === 'function') {
    port.postMessage(message);
    console.log('HELL YEAH2', message);
  }
});

runtime.onConnect.addListener(function (devToolsConnection) {
  if (devToolsConnection.name !== 'piral-inspector-host') {
    return;
  }

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

        tabPorts[tabId] = devToolsConnection;
      }
    }

    if (tabId) {
      // forward message to the contentScript.js
      tabs.sendMessage(tabId, message);
    }
  };

  devToolsConnection.onMessage.addListener(handler);

  devToolsConnection.onDisconnect.addListener(() => {
    devToolsConnection.onMessage.removeListener(handler);
    delete tabPorts[tabId];
  });
});