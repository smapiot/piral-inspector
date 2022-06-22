import { appendPilet } from './commands';

const checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
const checkV2 = /^\/\/\s*@pilet\s+v:2\s*(?:\(([A-Za-z0-9\_\:\-]+),\s*(.*)\))?/;
const isUrl = /^https?:\/\//;

function sha(alg: 1 | 256, str: string) {
  const buffer = new TextEncoder().encode(str);
  return crypto.subtle.digest(`SHA-${alg}`, buffer);
}

function toHex(hash: ArrayBuffer) {
  const codes: Array<string> = [];
  const view = new DataView(hash);
  const len = view.byteLength;

  for (let i = 0; i < len; ++i) {
    codes.push(view.getUint8(i).toString(16).padStart(2, '0'));
  }

  return codes.join('');
}

function toBase64(hash: ArrayBuffer) {
  const codes: Array<string> = [];
  const view = new Uint8Array(hash);
  const len = view.byteLength;

  for (let i = 0; i < len; ++i) {
    codes.push(String.fromCharCode(view[i]));
  }

  return `sha256-${btoa(codes.join(''))}`;
}

function computeHash(content: string) {
  return sha(1, content).then(toHex);
}

function computeIntegrity(content: string) {
  return sha(256, content).then(toBase64);
}

function getDependencies(deps: string, basePath: string) {
  try {
    const depMap = JSON.parse(deps);

    if (depMap && typeof depMap === 'object') {
      return Object.keys(depMap).reduce((obj, depName) => {
        const depUrl = depMap[depName];

        if (typeof depUrl === 'string') {
          const url = isUrl.test(depUrl) ? depUrl : `${basePath}${depUrl}`;
          obj[depName] = url;
        }

        return obj;
      }, {});
    }
  } catch {}

  return {};
}

async function getPiletSpecMeta(content: string, basePath: string) {
  if (checkV1.test(content)) {
    // uses single argument; requireRef (required)
    const [, requireRef] = checkV1.exec(content);
    return {
      spec: 'v1',
      requireRef,
      integrity: await computeIntegrity(content),
    };
  } else if (checkV2.test(content)) {
    // uses two arguments; requireRef and dependencies as JSON (required)
    const [, requireRef, plainDependencies] = checkV2.exec(content);
    return {
      spec: 'v2',
      requireRef,
      dependencies: getDependencies(plainDependencies, basePath),
    };
  } else {
    // uses no arguments
    return {
      spec: 'v0',
      hash: await computeHash(content),
      noCache: true,
    };
  }
}

export function injectPiletsFromUrl(url: string) {
  return fetch(url)
    .then((res) => res.text())
    .then(async (text) => {
      try {
        const r = JSON.parse(text);
        // it's a JSON manifest!
        const items = Array.isArray(r) ? r : Array.isArray(r.items) ? r.items : [];

        for (const item of items) {
          appendPilet(item);
        }
      } catch {
        const path = url.substring(url.indexOf('//') + 2).replace(/\//g, '-');
        const basePath = url.substring(0, url.lastIndexOf('/') + 1);
        const meta = await getPiletSpecMeta(text, basePath);

        // it's a JS (or non-JSON) file!
        appendPilet({
          name: `pilet-${path}`,
          version: '0.0.0',
          link: url,
          ...meta,
        });
      }
    });
}

export function checkJson(input: string) {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

export function getTheme() {
  const theme = localStorage.getItem('theme');

  if (theme) {
    return theme;
  } else {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (userPrefersDark) {
      return 'dark';
    } else {
      return 'light';
    }
  }
}
