import { runtime, devtools } from 'webextension-polyfill';
import { useStore } from './app/store';
import { PiHostMessage, PiWorkerMessage } from './types';
import { DevtoolsPanels } from 'webextension-polyfill/namespaces/devtools_panels';

type PanelCreate = (
  title: string,
  iconPath: string,
  pagePath: string,
  panelCreatedCallback: 
  (panel: DevtoolsPanels.ExtensionPanel) => void
  ) => void

  
async function initDevTools() {
  try {
    const port = runtime.connect(undefined, { name: 'piral-inspector-host' });

    const sendMessage = (message: PiHostMessage) => {
      const tabId = devtools.inspectedWindow.tabId;
      port.postMessage({
        message,
        tabId,
      });
    };

    /**
     * Cast needed because webextension polyfill does not support the right interfacing for v3
     * official documentation: https://developer.chrome.com/docs/extensions/reference/api/devtools/panels?hl=en#example
     */
    const panelCreate = devtools.panels.create as unknown as PanelCreate

    /**
     * Call is asynchronus but doesnt provide promise anymore, needs to be done with callback
     */
    panelCreate('Piral', '/assets/logo.png', './panel.html', (panel: DevtoolsPanels.ExtensionPanel) => {
      panel.onShown.addListener((panelWindow: Window) => {

        panelWindow.sendCommand = sendMessage;
        panelWindow.dispatchEvent(new CustomEvent('pi-store', { detail: useStore }));
      });

      port.onMessage.addListener((message: PiWorkerMessage) => {
        const { actions } = useStore.getState();

        switch (message.type) {
          case 'available':
            return actions.connect(message.name, message.version, message.kind, message.capabilities, message.state);
          case 'unavailable':
            return actions.disconnect();
          case 'pilets':
            return actions.updatePilets(message.pilets);
          case 'routes':
            return actions.updateRoutes(message.routes);
          case 'settings':
            return actions.updateSettings(message.settings);
          case 'container':
            return actions.updateContainer(message.container);
          case 'events':
            return actions.updateEvents(message.events);
          case 'extensions':
            return actions.updateExtensions(message.extensions);
          case 'info':
            return actions.updateInfo(message.name, message.version, message.kind, message.capabilities);
          case 'dependency-map':
            return actions.updateDependencyMap(message.dependencyMap);
        }
      });

      sendMessage({ type: 'init' });
    });
  } catch (err) {
    console.error(err.message);
  }
}

initDevTools();
