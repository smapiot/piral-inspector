import { useEffect } from 'react';
import { jsx } from '@emotion/core';
import { View } from './View';
import { useStore } from './store';
import { PiWorkerMessage } from '../types';

export interface AppProps {}

export const App: React.FC<AppProps> = () => {
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
          return actions.update(message.pilets);
      }
    };
    window.addEventListener('pi-recv-response', handler);

    return () => {
      window.removeEventListener('pi-recv-response', handler);
    };
  }, []);

  return <View />;
};
