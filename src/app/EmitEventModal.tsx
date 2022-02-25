import { FC, useState, ChangeEvent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { jsx } from '@emotion/core';
import { emitEvent } from './commands';
import { checkJson } from './utils';
import { appSectionView } from './styles';

export interface EmitEventModalProps {
  isOpen: boolean;
  toggle(): void;
}

const initialValues = {
  name: '',
  args: '{}',
};

export const EmitEventModal: FC<EmitEventModalProps> = ({ isOpen, toggle }) => {
  const [values, setValues] = useState(initialValues);
  const setValue = (e: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [e.currentTarget.name]: e.currentTarget.value });
  const eventNameValid = values.name !== '';
  const eventArgsValid = checkJson(values.args);
  const disabled = !eventArgsValid || !eventNameValid;

  const send = () => {
    if (!disabled) {
      emitEvent(values.name, JSON.parse(values.args));
      setValues(initialValues);
    }

    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Event Details</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="event-name">Name</Label>
          <Input
            id="event-name"
            valid={eventNameValid}
            invalid={!eventNameValid}
            value={values.name}
            name="name"
            onChange={setValue}
          />
        </FormGroup>
        <FormGroup>
          <Label for="event-args">Args (as JSON)</Label>
          <Input
            id="event-args"
            valid={eventArgsValid}
            invalid={!eventArgsValid}
            type="textarea"
            value={values.args}
            name="args"
            onChange={setValue}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={send} disabled={disabled}>
          Emit
        </Button>
      </ModalFooter>
    </Modal>
  );
};
