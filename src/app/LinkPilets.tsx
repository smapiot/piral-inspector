import { jsx } from '@emotion/core';
import { FC, useState, SyntheticEvent } from 'react';
import { Button, Form, Input, InputGroup, Progress, UncontrolledAlert } from 'reactstrap';
import { injectPiletsFromUrl } from './utils';

export interface LinkPiletsProps {}

export const LinkPilets: FC<LinkPiletsProps> = () => {
  const [url, setUrl] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [injecting, setInjecting] = useState(false);

  const submit = (e: SyntheticEvent) => {
    if (url) {
      setInjecting(true);
      injectPiletsFromUrl(url)
        .catch((err) =>
          setErrMessage(
            `${err.message} Please check if the target server is reachable and CORS is properly configured.`,
          ),
        )
        .finally(() => setInjecting(false));

      setUrl('');
    }

    e.preventDefault();
  };

  return (
    <Form onSubmit={submit}>
      <InputGroup>
        <Input type="text" value={url} onChange={(e) => setUrl(e.currentTarget.value)} />
        <Button color="primary" disabled={url === ''}>
          Add
        </Button>
      </InputGroup>

      {injecting && <Progress animated color="success" value={50} style={{ marginTop: 10 }} />}

      {errMessage && (
        <UncontrolledAlert color="danger" style={{ marginTop: 10 }}>
          Failed to add pilets: {errMessage}
        </UncontrolledAlert>
      )}
    </Form>
  );
};
