import { FC } from 'react';
import { jsx } from '@emotion/core';
import { BasicInfo } from './BasicInfo';
import { LinkPilets } from './LinkPilets';
import { UploadPilets } from './UploadPilets';
import { RecordedEvents } from './RecordedEvents';
import { AvailablePilets } from './AvailablePilets';
import { RegisteredRoutes } from './RegisteredRoutes';
import { StateContainer } from './StateContainer';
import { ExtensionCatalogue } from './ExtensionCatalogue';
import { useStore } from './store';
import { connectedView, notConnectedView, appSectionView } from './styles';

export interface ViewProps {}

export const View: FC<ViewProps> = () => {
  const { connected, capabilities } = useStore(m => m.state);

  if (connected) {
    return (
      <div css={connectedView}>
        <BasicInfo showSettings={capabilities.settings} />
        {capabilities.pilets && (
          <div css={appSectionView}>
            <h3>Available Pilets</h3>
            <p>The following pilets are currently running in your Piral instance.</p>
            <AvailablePilets />
          </div>
        )}
        {capabilities.pilets && (
          <div css={appSectionView}>
            <h3>Add Pilets</h3>
            <p>You can add a feed address or an address referring to a pilet root module.</p>
            <LinkPilets />
            <p>Alternatively, you can also bundle a local pilet and upload it here, too.</p>
            <UploadPilets />
          </div>
        )}
        {capabilities.routes && (
          <div css={appSectionView}>
            <h3>Registered Routes</h3>
            <p>The following routes are currently registered.</p>
            <RegisteredRoutes />
          </div>
        )}
        {capabilities.events && (
          <div css={appSectionView}>
            <h3>Events</h3>
            <p>These events from the Piral instance have been recorded so far.</p>
            <RecordedEvents />
          </div>
        )}
        {capabilities.container && (
          <div css={appSectionView}>
            <h3>State Container</h3>
            <p>The currently available global state.</p>
            <StateContainer />
          </div>
        )}
        {capabilities.extensions && (
          <div css={appSectionView}>
            <h3>Extension Catalogue</h3>
            <p>The registered extension components.</p>
            <ExtensionCatalogue />
          </div>
        )}
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
