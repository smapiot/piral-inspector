import { browser } from 'webextension-polyfill-ts';

export function setIconAndPopup(type: 'disabled' | 'production' | 'development', tabId: number) {
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
