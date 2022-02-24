import { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import {
  Alert,
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
import { extensionCatalogue } from './styles';

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

  // detect if the user prefers dark mode
  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <ListGroupItem css={extensionCatalogue}>
      <ListGroupItemHeading tag="a" href="#" onClick={toggle}>
        {name}
      </ListGroupItemHeading>
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
          <Button color={userPrefersDark? "secondary" : "primary"} onClick={send} disabled={disabled}>
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
      {extensions.length > 0 ? (
        extensions.map(name => <ExtensionItem name={name} key={name} />)
      ) : (
        <Alert color="warning">No extensions available.</Alert>
      )}
    </ListGroup>
  );
};
