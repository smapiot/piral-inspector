import { useEffect, FC, Fragment } from 'react';
import { jsx, Global } from '@emotion/core';
import { View } from './View';
import { useStore } from './store';
import { globalView } from './styles';
import { PiWorkerMessage } from '../types';

export interface AppProps {}

export const App: FC<AppProps> = () => {
  const actions = useStore(m => m.actions);

  useEffect(() => {
    const handler = (e: CustomEvent<PiWorkerMessage>) => {
      const message = e.detail;

      switch (message.type) {
        case 'available':
          return actions.connect(message.name, message.version, message.kind);
        case 'unavailable':
          return actions.disconnect();
        case 'pilets':
          return actions.updatePilets(message.pilets);
        case 'routes':
          return actions.updateRoutes(message.routes);
        case 'settings':
          return actions.updateSettings(message.settings);
        case 'container':
          return actions.updateContainer(message.container);
        case 'events':
          return actions.updateEvents(message.events);
      }
    };
    window.addEventListener('pi-recv-response', handler);

    return () => window.removeEventListener('pi-recv-response', handler);
  }, []);

  return (
    <Fragment>
      <Global styles={globalView} />
      <View />
    </Fragment>
  );
};
