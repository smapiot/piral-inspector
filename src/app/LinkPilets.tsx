import { FC, useState, SyntheticEvent } from 'react';
import { Button, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { jsx } from '@emotion/core';
import { injectPiletsFromUrl } from './utils';

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

  return (
    <Form onSubmit={submit}>
      <InputGroup>
        <Input type="text" value={url} onChange={e => setUrl(e.currentTarget.value)} />
        <InputGroupAddon addonType="append">
          <Button color="primary" disabled={url === ''}>
            Add
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};
