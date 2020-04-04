import { appendPilet } from './commands';

export function injectPiletsFromUrl(url: string) {
  return fetch(url)
    .then(res => res.json())
    .then(
      r => {
        // it's a JSON manifest!
        const items = Array.isArray(r) ? r : Array.isArray(r.items) ? r.items : [];

        for (const item of items) {
          appendPilet(item);
        }
      },
      () => {
        // it's a JS (or non-JSON) file!
        appendPilet({
          name: 'temp-pilet',
          version: '1.0.0',
          link: url,
        });
      },
    );
}
