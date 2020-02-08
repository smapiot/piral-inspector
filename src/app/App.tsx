import * as React from 'react';
import { View } from './View';
import { useStore } from './store';
import { PiWorkerMessage } from '../types';

export interface AppProps {}

export const App: React.FC<AppProps> = () => {
  const actions = useStore(m => m.actions);

  React.useEffect(() => {
    const handler = (e: CustomEvent<PiWorkerMessage>) => {
      const message = e.detail;

      switch (message.type) {
        case 'available':
          return actions.initialize(true);
        case 'unavailable':
          return actions.initialize(false);
      }
    };
    window.addEventListener('pi-recv-response', handler);

    return () => {
      window.removeEventListener('pi-recv-response', handler);
    };
  }, []);

  return <View />;
};
