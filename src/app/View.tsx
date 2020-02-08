import * as React from 'react';

export interface ViewProps {
  connected: boolean;
}

export const View: React.FC<ViewProps> = ({ connected }) => (
  <div>{connected ? <b>Connected!</b> : <span>Not connected!</span>}</div>
);
