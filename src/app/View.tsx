import { FC } from 'react';
import { jsx } from '@emotion/core';
import { LinkPilets } from './LinkPilets';
import { AvailablePilets } from './AvailablePilets';
import { RegisteredRoutes } from './RegisteredRoutes';
import { useStore } from './store';
import { connectedView, notConnectedView, appSectionView } from './styles';

export interface ViewProps {}

export const View: FC<ViewProps> = () => {
  const { connected, name, version } = useStore(m => m.state);

  if (connected) {
    return (
      <div css={connectedView}>
        <h2>
          {name} ({version})
        </h2>
        <div css={appSectionView}>
          <h3>Available Pilets</h3>
          <p>The following pilets are currently running in your Piral instance.</p>
          <AvailablePilets />
        </div>
        <div css={appSectionView}>
          <h3>Add Pilets</h3>
          <p>You can add a feed address or an address referring to a pilet root module.</p>
          <LinkPilets />
        </div>
        <div css={appSectionView}>
          <h3>Registered Routes</h3>
          <p>The following routes are currently registered.</p>
          <RegisteredRoutes />
        </div>
      </div>
    );
  }

  return (
    <div css={notConnectedView}>
      <h2>Not connected</h2>
      <p>You are currently not running a Piral instance in debug mode.</p>
      <p>Note that you need to run Piral v0.10 or later on localhost for Piral Inspector to work.</p>
    </div>
  );
};
