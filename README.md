# piral-inspector

A DevTools extension for Piral instances and their pilets.

## Download Links

- [Firefox Add-Ons](https://addons.mozilla.org)
- [Chrome Marketplace](https://chrome.google.com/webstore/detail/piral-inspector/ikbpelpjfgmplidagknaaegjhfigcbfl)
- [Opera Addons](https://addons.opera.com/en/extensions/details/piral-inspector/)

## Description

This simple devtools extension lets you inspect and manipulate your Piral instance for debugging purposes. It only works when either debugging a Piral instance or running a pilet in an emulator version of a Piral instance.

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
4. If you want to develop run either
   - `npm watch:firefox` to watch for Firefox
   - `npm watch:chrome` to watch for Chrome
5. Deploying requires having all the secrets in environment variables

All source files are available in the `src` folder.

## License

The code is licensed [under the MIT license](./LICENSE).
