import { jsx } from '@emotion/core';
import { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import {
  Alert,
  Button,
  FormGroup,
  FormText,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';
import { goToRoute } from './commands';
import { useStore } from './store';
import { checkJson } from './utils';
import { actionItem } from './styles';

interface ExtensionItemProps {
  name: string;
}

const ExtensionItem: FC<ExtensionItemProps> = ({ name }) => {
  const [isOpen, setOpen] = useState(false);
  const [params, setParams] = useState('{}');
  const toggle = (ev: SyntheticEvent) => {
    setOpen(!isOpen);
    ev.preventDefault();
  };
  const setValue = (e: ChangeEvent<HTMLInputElement>) => setParams(e.currentTarget.value);
  const disabled = !checkJson(params);

  const send = (ev: SyntheticEvent) => {
    if (!disabled) {
      goToRoute('/$debug-extension-catalogue', {
        name,
        params: JSON.parse(params),
      });
    }

    toggle(ev);
  };

  return (
    <ListGroupItem>
      <ListGroupItemHeading onClick={toggle} css={actionItem}>
        {name}
      </ListGroupItemHeading>
      {isOpen && (
        <ListGroupItemText>
          <FormGroup>
            <Label for="ext-params">
              Parameters represented via <code>params</code>:
            </Label>
            <Input
              id="ext-params"
              valid={!disabled}
              invalid={disabled}
              type="textarea"
              value={params}
              style={{ fontFamily: 'monospace' }}
              name="args"
              onChange={setValue}
            />
            <FormText>Enter the values using valid JSON.</FormText>
          </FormGroup>
          <Button color="primary" onClick={send} disabled={disabled}>
            Render
          </Button>
        </ListGroupItemText>
      )}
    </ListGroupItem>
  );
};

export interface ExtensionCatalogueProps {}

export const ExtensionCatalogue: FC<ExtensionCatalogueProps> = () => {
  const extensions = useStore((m) => m.state.extensions);

  return (
    <ListGroup>
      {extensions.length > 0 ? (
        extensions.map((name) => <ExtensionItem name={name} key={name} />)
      ) : (
        <Alert color="warning">No extensions available.</Alert>
      )}
    </ListGroup>
  );
};
