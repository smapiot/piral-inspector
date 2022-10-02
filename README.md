[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral Inspector](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral-inspector/blob/main/LICENSE) [![GitHub Tag](https://img.shields.io/github/tag/smapiot/piral-inspector.svg)](https://github.com/smapiot/piral-inspector/releases) [![GitHub Issues](https://img.shields.io/github/issues/smapiot/piral-inspector.svg)](https://github.com/smapiot/piral-inspector/issues) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community) [![CLA Assistant](https://cla-assistant.io/readme/badge/smapiot/piral)](https://cla-assistant.io/smapiot/piral)

A DevTools extension for Piral instances and their pilets.

## Download Links

- [Firefox Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/piral-inspector/)
- [Chrome Marketplace](https://chrome.google.com/webstore/detail/piral-inspector/ikbpelpjfgmplidagknaaegjhfigcbfl)
- [Opera Addons](https://addons.opera.com/en/extensions/details/piral-inspector/)
- [Edge Extensions](https://microsoftedge.microsoft.com/addons/detail/piral-inspector/hbdhpkhidilkmkbkklcbjgddbeodibml)

## Description

This simple devtools extension lets you inspect and manipulate your Piral instance for debugging purposes. It only works when either debugging a Piral instance or running a pilet in an emulator version of a Piral instance.

## Introductory Video

We placed a quick introduction video on YouTube.

[![Piral Inspector](http://img.youtube.com/vi/8CE7_X01NmM/0.jpg)](http://www.youtube.com/watch?v=8CE7_X01NmM "Piral Inspector")

## Functionality

Right now the Piral Inspector comes with the following set of functionality:

- Detection of the running Piral instance (name, version)
- See and call the registered routes
- See and unload the loaded pilets
- Look at the used dependencies
- Inspect the available extensions
- Toggle global settings such as state container logging
- Load new pilets from their root module URL
- Load new pilets from a given feed URL
- Load new pilets from a tarball

## How to Build

You'll need the following tools:

1. Node.js (at least version 10)
2. NPM (usually comes with Node.js)
3. Git
4. A command line interpreter

For building the solution the following steps should be followed.

1. Clone the repository
2. Run `npm install` in the cloned repository
3. If you want to build / publish run either
   - `npm build:firefox` to build for Firefox
   - `npm build:opera` to build for Opera
   - `npm build:chrome` to build for Chrome
   - `npm build:edge` to build for Edge
4. If you want to develop run either
   - `npm watch:firefox` to watch for Firefox
   - `npm watch:opera` to watch for Opera
   - `npm watch:chrome` to watch for Chrome
   - `npm watch:edge` to watch for Edge
5. Deploying requires having all the secrets in environment variables

All source files are available in the `src` folder.

## Architecture

The extension follows the general guidelines for building browser extensions that send and retrieve information from a website in a dev tools panel. The architecture looks as follows:

![Architecture](./docs/architecture.png)

The singleton [background script](./src/scripts/background.ts) is the exchange driver between a website and the dev tools panel. The website (restricted to `localhost`, i.e., Piral instances in development) can be accessed through the [content script](./src/scripts/contentScript.ts), which knows how to talk to the Piral Debug API.

The Piral Debug API comes from the [piral-debug-utils](https://www.npmjs.com/package/piral-debug-utils) npm package. Right now its quite flexible and fully message based. However, in the past this has been achieved from the Piral Inspector itself. In order to still support such older Piral instances the [legacy API](./src/scripts/legacy/worker.ts) is still part of the Piral Inspector.

The dev tools panel is a small [web app](./src/app/index.html). Mainly, it is driven by [message exchange with the background script](./src/devtools.ts). As such when a panel opens it sends a message to the website (via the background script) to get the initial state.

## License

The code is licensed [under the MIT license](./LICENSE).
