import browser from 'webextension-polyfill';

function handleShown() {
  console.log('panel is being shown');
}

function handleHidden() {
  console.log('panel is being hidden');
}

function initPanels() {
  return browser.devtools.panels.create('Piral', '/assets/logo.png', './app/index.html');
}

initPanels()
  .then((newPanel: any) => {
    newPanel.onShown.addListener(handleShown);
    newPanel.onHidden.addListener(handleHidden);
  })
  .catch((err: Error) => {
    console.error('An unexpected error occured while setting up the panels.', err);
    throw err;
  });
