import { FC, useState, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, FormGroup, Input, Label } from 'reactstrap';
import { jsx } from '@emotion/core';
import { updateSettings } from './commands';
import { PiralDebugSettings } from '../types';

export interface AdjustSettingsModalProps {
  isOpen: boolean;
  toggle(): void;
  settings: PiralDebugSettings;
  initialValues: Record<string, any>;
}

export const AdjustSettingsModal: FC<AdjustSettingsModalProps> = ({ settings, isOpen, toggle, initialValues }) => {
  const [values, setValues] = useState(initialValues);
  const send = useCallback(() => {
    updateSettings(values);
    toggle();
  }, [values, toggle]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Debug Settings</ModalHeader>
      <ModalBody>
        <FormGroup>
          <div>
            {Object.keys(settings).map(name => {
              const setting = settings[name];

              switch (setting.type) {
                case 'number':
                  return (
                    <FormGroup>
                      <Label for={`number-${name}`}>{setting.label}</Label>
                      <Input
                        type="number"
                        id={`number-${name}`}
                        value={values[name]}
                        onChange={e => setValues({ ...values, [name]: e.target.valueAsNumber })}
                      />
                    </FormGroup>
                  );
                case 'string':
                  return (
                    <FormGroup>
                      <Label for={`text-${name}`}>{setting.label}</Label>
                      <Input
                        type="text"
                        id={`text-${name}`}
                        value={values[name]}
                        onChange={e => setValues({ ...values, [name]: e.target.value })}
                      />
                    </FormGroup>
                  );
                case 'boolean':
                  return (
                    <CustomInput
                      type="switch"
                      label={setting.label}
                      id={`switch-${name}`}
                      checked={values[name]}
                      onChange={e => setValues({ ...values, [name]: e.target.checked })}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </FormGroup>
        <p style={{ fontSize: '0.8em' }}>We recommend to refresh the page after changing these settings.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={send}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
