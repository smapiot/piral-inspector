import { FC } from 'react';
import { jsx } from '@emotion/core';
import { ConnectedView } from './ConnectedView';
import { useStore } from './store';
import { notConnectedView } from './styles';

export interface ViewProps {}

export const View: FC<ViewProps> = () => {
  const { connected, capabilities } = useStore(m => m.state);

  if (connected) {
    return <ConnectedView capabilities={capabilities} />;
  } else {
    return (
      <div css={notConnectedView}>
        <h2>Not connected</h2>
        <p>You are currently not running a Piral instance in debug mode.</p>
        <p>Note that you need to run Piral v0.10 or later on localhost for Piral Inspector to work.</p>
      </div>
    );
  }
};
