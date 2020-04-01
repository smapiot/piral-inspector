import {browser} from 'webextension-polyfill-ts';

const tabs: Record<string, any> = {};
let host = undefined;

browser.runtime.onConnect.addListener((port: any) => {
  if (port.name === 'piral-inspector-worker') {
    const tabId = port.sender.tab.id;

    const handler = ({ message }: any) => {
      if (host) {
        host.postMessage(message);
      }
    };

    tabs[tabId] = port;

    port.onMessage.addListener(handler);

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(handler);
      delete tabs[tabId];
    });
  } else if (port.name === 'piral-inspector-host') {
    const handler = ({ message, tabId }: any) => {
      const p = tabs[tabId];

      if (p) {
        p.postMessage(message);
      }
    };

    host = port;

    port.onMessage.addListener(handler);

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(handler);
      host = undefined;
    });
  }
});
