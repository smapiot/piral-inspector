import { FC } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { jsx } from '@emotion/core';

export interface EmitEventModalProps {
  isOpen: boolean;
  toggle(): void;
}

export const EmitEventModal: FC<EmitEventModalProps> = ({ isOpen, toggle }) => {
  const send = () => {
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Event Details</ModalHeader>
      <ModalBody></ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={send}>
          Emit
        </Button>
      </ModalFooter>
    </Modal>
  );
};
