import { Fragment, useMemo, useState } from 'react';
import { jsx } from '@emotion/core';
import { LinkPilets } from './LinkPilets';
import { UploadPilets } from './UploadPilets';
import { RecordedEvents } from './RecordedEvents';
import { AvailablePilets } from './AvailablePilets';
import { RegisteredRoutes } from './RegisteredRoutes';
import { StateContainer } from './StateContainer';
import { ExtensionCatalogue } from './ExtensionCatalogue';
import { appSectionView } from './styles';
import { PiralDebugCapabilities } from '../types';

const PiletsTab = {
  id: 'pilets',
  title: 'Pilets',
  content: (
    <Fragment>
      <div css={appSectionView}>
        <h3>Available Pilets</h3>
        <p>The following pilets are currently running in your Piral instance.</p>
        <AvailablePilets />
      </div>
      <div css={appSectionView}>
        <h3>Add Pilets</h3>
        <p>You can add a feed address or an address referring to a pilet root module.</p>
        <LinkPilets />
        <p>Alternatively, you can also bundle a local pilet and upload it here, too.</p>
        <UploadPilets />
      </div>
    </Fragment>
  ),
};

const RoutesTab = {
  id: 'routes',
  title: 'Pages',
  content: (
    <div css={appSectionView}>
      <h3>Registered Routes</h3>
      <p>The following routes are currently registered.</p>
      <RegisteredRoutes />
    </div>
  ),
};

const EventsTab = {
  id: 'events',
  title: 'Events',
  content: (
    <div css={appSectionView}>
      <h3>Events</h3>
      <p>These events from the Piral instance have been recorded so far.</p>
      <RecordedEvents />
    </div>
  ),
};

const ExtensionsTab = {
  id: 'extensions',
  title: 'Extensions',
  content: (
    <div css={appSectionView}>
      <h3>Extension Catalogue</h3>
      <p>The registered extension components.</p>
      <ExtensionCatalogue />
    </div>
  ),
};

const StateTab = {
  id: 'state',
  title: 'App State',
  content: (
    <div css={appSectionView}>
      <h3>State Container</h3>
      <p>The currently available global state.</p>
      <StateContainer />
    </div>
  ),
};

export function useViews(capabilities: PiralDebugCapabilities) {
  const availableTabs = useMemo(
    () =>
      [
        capabilities.pilets && PiletsTab,
        capabilities.routes && RoutesTab,
        capabilities.extensions && ExtensionsTab,
        capabilities.events && EventsTab,
        capabilities.container && StateTab,
      ].filter(Boolean),
    [capabilities],
  );
  const [activeTab, setActiveTab] = useState(availableTabs[0].id);
  return { availableTabs, activeTab, setActiveTab };
}
