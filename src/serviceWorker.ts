import { Runtime, runtime, scripting, storage, tabs } from 'webextension-polyfill';

runtime.onMessage.addListener(async function (message, sender) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  console.log(message);

  if (message.type === 'available') {
    const type = message.mode === 'production' ? 'production' : 'development';
    //setIconAndPopup(type, tabId);
  }

  if (message.type === 'cs-connect') {
    console.log('CS CONNECT');
    tabs.sendMessage(sender.tab?.id, { type: 'init' });
  }

  if (message.type === 'init') {
    console.log('FROM DEVTOOLS');
  }
});

runtime.onConnect.addListener(function (devToolsConnection) {
  console.log('ON CONNECT ', devToolsConnection);

  if (devToolsConnection.name !== 'piral-inspector-host') {
    return;
  }

  let tabId: number;

  const handler = (ev: any) => {
    const message = ev.message;
    console.log('devToolsConnection handler', message);

    if (!message) {
      return;
    }

    // @todo modify this code to use the v3 storage functionality and connect the panel
    if (message.type === 'init') {
      // handle initialize message to connect contentScript.js with devtools.js
      console.log(1, ev, devToolsConnection);
      /*
      if (tabId === undefined) {
          tabId = ev.tabId;
          tabPorts[tabId] = port;
        }
      */
    }

    if (tabId) {
      // forward message to the contentScript.js
      tabs.sendMessage(tabId, message);
    }
  };

  devToolsConnection.onMessage.addListener(handler);

  devToolsConnection.onDisconnect.addListener(() => {
    devToolsConnection.onMessage.removeListener(handler);
  });
});
