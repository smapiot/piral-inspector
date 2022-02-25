import { FC, SyntheticEvent, useState, Fragment, useMemo, useCallback } from 'react';
import { jsx } from '@emotion/core';
import { AdjustSettingsModal } from './AdjustSettingsModal';
import { useStore } from './store';
import { visualizeAll } from './commands';
import { basicInfoView } from './styles';
import VisualizeIcon from './VisualizeIcon';
import SettingsIcon from './SettingsIcon';
import { store } from './store';

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

export const BasicInfo: FC<BasicInfoProps> = ({ showSettings }) => {
  const [isOpen, setOpen] = useState(false);
  const { settings, name, version } = useStore(m => m.state);
  const toggle = useCallback(() => setOpen(s => !s), []);
  const visualize = useClick(visualizeAll);
  const toggleSettings = useClick(toggle);
  const values = useMemo(() => {
    const obj: Record<string, any> = {};

    Object.keys(settings).forEach(s => {
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
              <a href="#" title="Visualize" onClick={visualize}>
                <VisualizeIcon />
              </a>
            )}
            <a href="#" title="Settings" onClick={toggleSettings}>
              <SettingsIcon />
            </a>
          </Fragment>
        )}
      </div>
      <AdjustSettingsModal toggle={toggle} isOpen={isOpen} settings={settings} initialValues={values} />
    </Fragment>
  );
};
