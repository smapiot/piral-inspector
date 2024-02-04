import { jsx } from '@emotion/core';
import { FC, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { goToRoute } from './commands';

export interface ConfigureRouteModalProps {
  parameters: Array<string>;
  isOpen: boolean;
  toggle(): void;
  route: string;
}

export const ConfigureRouteModal: FC<ConfigureRouteModalProps> = ({ parameters, isOpen, toggle, route }) => {
  const [values, setValues] = useState(parameters);
  const setValue = (n: string, i: number) => setValues(values.map((o, j) => (i !== j ? o : n)));
  const send = () => {
    let url = route;

    for (let i = 0; i < parameters.length; i++) {
      url = url.replace(`:${parameters[i]}`, values[i]);
    }

    goToRoute(url);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Set Parameters</ModalHeader>
      <ModalBody>
        {parameters.map((p, i) => (
          <FormGroup key={i}>
            <Label for={`${p}_${i}`}>{p}</Label>
            <Input id={`${p}_${i}`} value={values[i]} onChange={e => setValue(e.currentTarget.value, i)} />
          </FormGroup>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={send}>
          Open
        </Button>
      </ModalFooter>
    </Modal>
  );
};
