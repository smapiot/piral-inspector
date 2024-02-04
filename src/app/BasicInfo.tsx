import { jsx } from '@emotion/core';
import { FC, SyntheticEvent, useState, Fragment, useMemo, useCallback } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { AdjustSettingsModal } from './AdjustSettingsModal';
import { useStore } from './store';
import { visualizeAll } from './commands';
import { basicInfoView } from './styles';

import VisualizeIcon from './VisualizeIcon';
import SettingsIcon from './SettingsIcon';

export interface BasicInfoProps {
  showSettings?: boolean;
}

function useClick(cb: () => void) {
  return useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      cb();
    },
    [cb],
  );
}

const notitle = {};

export const BasicInfo: FC<BasicInfoProps> = ({ showSettings }) => {
  const [isOpen, setOpen] = useState(false);
  const { settings, name, version } = useStore((m) => m.state);
  const toggle = useCallback(() => setOpen((s) => !s), []);
  const visualize = useClick(visualizeAll);
  const toggleSettings = useClick(toggle);
  const values = useMemo(() => {
    const obj: Record<string, any> = {};

    Object.keys(settings).forEach((s) => {
      obj[s] = settings[s].value;
    });

    return obj;
  }, [settings]);

  return (
    <Fragment>
      <div css={basicInfoView}>
        <h2>
          {name} ({version})
        </h2>
        {showSettings && (
          <Fragment>
            {values.viewOrigins && (
              <Fragment>
                <a href="#" onClick={visualize} id="visualize-btn" {...notitle}>
                  <VisualizeIcon />
                </a>
                <UncontrolledTooltip placement="top" target="visualize-btn">
                  Visualize
                </UncontrolledTooltip>
              </Fragment>
            )}
            <a href="#" onClick={toggleSettings} id="settings-btn" {...notitle}>
              <SettingsIcon />
            </a>
            <UncontrolledTooltip placement="top" target="settings-btn">
              Settings
            </UncontrolledTooltip>
          </Fragment>
        )}
      </div>
      <AdjustSettingsModal toggle={toggle} isOpen={isOpen} settings={settings} initialValues={values} />
    </Fragment>
  );
};
