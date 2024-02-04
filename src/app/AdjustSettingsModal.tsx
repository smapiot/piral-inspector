import { jsx } from '@emotion/core';
import { FC, useState, useCallback, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import { updateSettings } from './commands';
import { useStore } from './store';
import { miniInfo } from './styles';
import { PiralDebugSettings } from '../types';

const defaultGeneralNames = ['viewState', 'loadPilets', 'hardRefresh', 'clearConsole'];
const defaultInspectorNames = ['persistSettings'];
const defaultExtensionNames = ['viewOrigins', 'extensionCatalogue'];

function getGroup(name: string, group: string) {
  if (group) {
    return group;
  } else if (defaultGeneralNames.includes(name)) {
    return 'general';
  } else if (defaultInspectorNames.includes(name)) {
    return 'inspector';
  } else if (defaultExtensionNames.includes(name)) {
    return 'extensions';
  }

  return 'other';
}

function insert<T>(array: Array<T>, index: number, item: T): T {
  array.splice(index, 0, item);
  return item;
}

function useSettings(settings: PiralDebugSettings) {
  const actions = useStore((m) => m.actions);
  const currentTheme = useStore((m) => m.state.theme);
  const groupedSettings = [
    { id: 'general', items: [] },
    {
      id: 'inspector',
      items: [
        {
          name: 'theme',
          value: currentTheme === 'dark',
          label: `Enable dark mode`,
          type: 'boolean',
          change: actions.toggleTheme,
        },
      ],
    },
    { id: 'extensions', items: [] },
    { id: 'other', items: [] },
  ];

  for (const [name, item] of Object.entries(settings)) {
    const gid = getGroup(name, item.group);
    const group =
      groupedSettings.find((g) => g.id === gid) ||
      insert(groupedSettings, groupedSettings.length - 1, {
        id: gid,
        items: [],
      });

    group.items.push({
      name,
      label: item.label,
      type: item.type,
      value: undefined,
      change: undefined,
    });
  }

  return groupedSettings;
}

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

  const allSettings = useSettings(settings);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Debug Settings</ModalHeader>
      <ModalBody>
        {allSettings.map((settings) => (
          <FormGroup key={settings.id}>
            <h3>{settings.id}</h3>
            <div>
              {settings.items.map((item) => {
                switch (item.type) {
                  case 'number':
                    return (
                      <FormGroup key={item.name}>
                        <Label for={`number-${item.name}`}>{item.label}</Label>
                        <Input
                          type="number"
                          id={`number-${item.name}`}
                          value={item.value ?? values[item.name]}
                          onChange={
                            item.change ?? ((e) => setValues({ ...values, [item.name]: e.target.valueAsNumber }))
                          }
                        />
                      </FormGroup>
                    );
                  case 'string':
                    return (
                      <FormGroup key={item.name}>
                        <Label for={`text-${item.name}`}>{item.label}</Label>
                        <Input
                          type="text"
                          id={`text-${item.name}`}
                          value={item.value ?? values[item.name]}
                          onChange={item.change ?? ((e) => setValues({ ...values, [item.name]: e.target.value }))}
                        />
                      </FormGroup>
                    );
                  case 'boolean':
                    return (
                      <Input
                        type="switch"
                        key={item.name}
                        label={item.label}
                        id={`switch-${name}`}
                        checked={item.value ?? values[item.name]}
                        onChange={item.change ?? ((e) => setValues({ ...values, [item.name]: e.target.checked }))}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </FormGroup>
        ))}
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
