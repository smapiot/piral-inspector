import { FC, useState, SyntheticEvent } from 'react';
import { Button, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { jsx } from '@emotion/core';
import { injectPiletsFromUrl } from './utils';
import { appSectionView } from './styles';

export interface LinkPiletsProps {}

export const LinkPilets: FC<LinkPiletsProps> = () => {
  const [url, setUrl] = useState('');

  const submit = (e: SyntheticEvent) => {
    if (url) {
      injectPiletsFromUrl(url);
      setUrl('');
    }

    e.preventDefault();
  };

  // detect if the user prefers dark mode
  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <Form onSubmit={submit} css={appSectionView}>
      <InputGroup>
        <Input type="text" value={url} onChange={e => setUrl(e.currentTarget.value)} />
        <InputGroupAddon addonType="append">
          <Button disabled={url === ''}>Add</Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};
