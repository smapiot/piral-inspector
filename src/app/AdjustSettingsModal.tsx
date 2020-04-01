import { FC, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, FormGroup } from 'reactstrap';
import { jsx } from '@emotion/core';
import { updateSettings } from './commands';
import { PiralDebugSettings } from '../types';

export interface AdjustSettingsModalProps {
  isOpen: boolean;
  toggle(): void;
  settings: PiralDebugSettings;
}

export const AdjustSettingsModal: FC<AdjustSettingsModalProps> = ({ settings, isOpen, toggle }) => {
  const [values, setValues] = useState(settings);
  const send = () => {
    updateSettings(values);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Debug Settings</ModalHeader>
      <ModalBody>
        <FormGroup>
          <div>
            <CustomInput
              type="switch"
              label="State Container Logging"
              id="switch-view-state"
              checked={values.viewState}
              onChange={e => setValues({ ...values, viewState: e.target.checked })}
            />
            <CustomInput
              type="switch"
              label="Load available Pilets"
              id="switch-load-pilets"
              checked={values.loadPilets}
              onChange={e => setValues({ ...values, loadPilets: e.target.checked })}
            />
          </div>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={send}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
