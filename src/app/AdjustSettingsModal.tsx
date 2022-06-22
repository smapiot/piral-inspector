import { FC, useState, useCallback, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, FormGroup, Input, Label } from 'reactstrap';
import { jsx } from '@emotion/core';
import { updateSettings } from './commands';
import { useStore } from './store';
import { miniInfo } from './styles';
import { PiralDebugSettings } from '../types';

export interface AdjustSettingsModalProps {
  isOpen: boolean;
  toggle(): void;
  settings: PiralDebugSettings;
  initialValues: Record<string, any>;
}

export const AdjustSettingsModal: FC<AdjustSettingsModalProps> = ({ settings, isOpen, toggle, initialValues }) => {
  const [values, setValues] = useState({});
  const send = useCallback(() => {
    updateSettings(values);
    toggle();
  }, [values, toggle]);

  useEffect(() => setValues(initialValues), [initialValues]);

  const actions = useStore(m => m.actions);
  const currentTheme = useStore(m => m.state.theme);
  const otherTheme = currentTheme === 'dark' ? 'light' : 'dark';

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
                    <FormGroup key={name}>
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
                    <FormGroup key={name}>
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
                      key={name}
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
            <CustomInput
              type="switch"
              label={`Switch to ${otherTheme} mode`}
              id="change theme"
              onChange={actions.toggleTheme}
            />
          </div>
        </FormGroup>
        <p css={miniInfo}>We recommend to refresh the page after changing these settings.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={send}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
