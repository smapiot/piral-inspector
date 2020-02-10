import { FC, useState, SyntheticEvent } from 'react';
import { jsx } from '@emotion/core';
import { appendPilet } from './commands';

export interface LinkPiletsProps {}

export const LinkPilets: FC<LinkPiletsProps> = () => {
  const [url, setUrl] = useState('');

  const submit = (e: SyntheticEvent) => {
    if (url) {
      fetch(url)
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
      setUrl('');
    }

    e.preventDefault();
  };

  return (
    <form onSubmit={submit}>
      <input type="text" value={url} onChange={e => setUrl(e.currentTarget.value)} />
      <button disabled={url === ''}>Add</button>
    </form>
  );
};
