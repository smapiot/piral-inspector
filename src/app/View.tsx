import * as React from 'react';
import { useStore } from './store';

export interface ViewProps {}

export const View: React.FC<ViewProps> = () => {
  const connected = useStore(m => m.state.connected);

  if (connected) {
    return (
      <div>
        <b>Connected!</b>
      </div>
    );
  }

  return <div>Not connected.</div>;
};
