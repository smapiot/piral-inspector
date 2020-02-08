import browser from 'webextension-polyfill';

const tabs: Record<string, any> = {};
let host = undefined;

browser.runtime.onConnect.addListener((port: any) => {
  if (port.name === 'piral-inspector-worker') {
    const tabId = port.sender.tab.id;

    const extensionListener = ({ message }: any) => {
      if (host) {
        host.postMessage(message);
      }
    };

    tabs[tabId] = port;

    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(extensionListener);
      delete tabs[tabId];
    });
  } else if (port.name === 'piral-inspector-host') {
    const extensionListener = ({ message, tabId }: any) => {
      const p = tabs[tabId];

      if (p) {
        p.postMessage(message);
      }
    };

    host = port;

    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(extensionListener);
      host = undefined;
    });
  }
});
