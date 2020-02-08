import * as React from 'react';
import { View, ViewProps } from './View';
import { PiWorkerMessage } from '../types';

export interface AppProps {}

export const App: React.FC<AppProps> = () => {
  const [state, setState] = React.useState<ViewProps>(() => ({
    connected: false,
  }));

  React.useEffect(() => {
    const handler = (e: CustomEvent<PiWorkerMessage>) => {
      const message = e.detail;

      switch (message.type) {
        case 'available':
          return setState({
            connected: true,
          });
        case 'unavailable':
          return setState({
            connected: false,
          });
      }
    };
    window.addEventListener('pi-recv-response', handler);

    return () => {
      window.removeEventListener('pi-recv-response', handler);
    };
  }, []);

  return <View {...state} />;
};
