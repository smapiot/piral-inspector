import browser from 'webextension-polyfill';

async function initPanels() {
  console.log('Hello world!');
  await browser.devtools.panels.create(
    "Piral",
    "/assets/logo.png",
    "/devtools-greeting/index.html"
  );
}

initPanels().catch(err => {
  console.error('An unexpected error occured while setting up the panels.', err);
  throw err;
});
