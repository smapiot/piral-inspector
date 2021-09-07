import { ChangeEvent, FC, useState } from 'react';
import {
  Button,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';
import { jsx } from '@emotion/core';
import { goToRoute } from './commands';
import { useStore } from './store';
import { checkJson } from './utils';

interface ExtensionItemProps {
  name: string;
}

const ExtensionItem: FC<ExtensionItemProps> = ({ name }) => {
  const [isOpen, setOpen] = useState(false);
  const [params, setParams] = useState('{}');
  const toggle = () => setOpen(!isOpen);
  const setValue = (e: ChangeEvent<HTMLInputElement>) => setParams(e.currentTarget.value);
  const disabled = !checkJson(params);

  const send = () => {
    if (!disabled) {
      goToRoute('/$debug-extension-catalogue', {
        name,
        params: JSON.parse(params),
      });
    }

    toggle();
  };

  return (
    <ListGroupItem>
      <ListGroupItemHeading onClick={toggle}>{name}</ListGroupItemHeading>
      {isOpen && (
        <ListGroupItemText>
          <FormGroup>
            <Label for="ext-params">Params (as JSON)</Label>
            <Input
              id="ext-params"
              valid={!disabled}
              invalid={disabled}
              type="textarea"
              value={params}
              name="args"
              onChange={setValue}
            />
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
  const extensions = useStore(m => m.state.extensions);

  return (
    <ListGroup>
      {extensions.map(name => (
        <ExtensionItem name={name} key={name} />
      ))}
    </ListGroup>
  );
};
