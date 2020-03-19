import { FC, useState, useMemo } from 'react';
import { ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { jsx } from '@emotion/core';
import { goToRoute } from './commands';

export interface ShowRouteProps {
  route: string;
}

const paramsRx = /:([a-zA-Z0-9]+)\??/g;

function getParameters(route: string) {
  const parameters: Array<string> = [];
  let result = paramsRx.exec(route);

  while (result) {
    parameters.push(result[1]);
    result = paramsRx.exec(route);
  }

  return parameters;
}

export const ShowRoute: FC<ShowRouteProps> = ({ route }) => {
  const parameters = useMemo(() => getParameters(route), [route]);
  const [values, setValues] = useState(parameters);
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!isOpen);
  const setValue = (n: string, i: number) => setValues(values.map((o, j) => (i !== j ? o : n)));
  const send = () => {
    let url = route;

    for (let i = 0; i < parameters.length; i++) {
      url.replace(parameters[i], values[i]);
    }

    goToRoute(url);
    toggle();
  };
  const hasParams = parameters.length > 0;
  const open = hasParams ? toggle : () => goToRoute(route);

  return (
    <ListGroupItem>
      {hasParams && (
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>Set Parameters</ModalHeader>
          <ModalBody>
            {parameters.map((p, i) => (
              <FormGroup key={i}>
                <Label for={`${p}_${i}`}>{p}</Label>
                <Input type="text" id={`${p}_${i}`} value={values[i]} onChange={e => setValue(e.target.value, i)} />
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={send}>
              Open
            </Button>
          </ModalFooter>
        </Modal>
      )}
      <Button onClick={open}>
        <span aria-hidden>&#128279;</span>
      </Button>
      {route}
    </ListGroupItem>
  );
};
