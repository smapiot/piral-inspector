import { Fragment, useMemo, useState } from 'react';
import { jsx } from '@emotion/core';
import { LinkPilets } from './LinkPilets';
import { UploadPilets } from './UploadPilets';
import { RecordedEvents } from './RecordedEvents';
import { AvailablePilets } from './AvailablePilets';
import { RegisteredRoutes } from './RegisteredRoutes';
import { StateContainer } from './StateContainer';
import { ExtensionCatalogue } from './ExtensionCatalogue';
import { Dependencies } from './Dependencies';
import { appSectionView } from './styles';
import { PiralDebugCapabilities } from '../types';

interface TabProps {
  active: boolean;
}

const PiletsTab = {
  id: 'pilets',
  title: 'Pilets',
  Content: (props: TabProps) => (
    <Fragment>
      <div css={appSectionView}>
        <h3>Available Pilets</h3>
        <p>The following pilets are currently running in your Piral instance.</p>
        <AvailablePilets />
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
  Content: (props: TabProps) => (
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
  Content: (props: TabProps) => (
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
  Content: (props: TabProps) => (
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
  Content: (props: TabProps) => (
    <div css={appSectionView}>
      <h3>State Container</h3>
      <p>The currently available global state.</p>
      <StateContainer />
    </div>
  ),
};

const DependenciesTab = {
  id: 'dependencies',
  title: 'Dependencies',
  Content: (props: TabProps) => (
    <div css={appSectionView}>
      <h3>Dependency Map</h3>
      <p>This map shows the pilets incl. their demanded and resolved dependencies.</p>
      <Dependencies active={props.active} />
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
        capabilities['dependency-map'] && DependenciesTab,
      ].filter(Boolean),
    [capabilities],
  );
  const [activeTab, setActiveTab] = useState(availableTabs[0].id);
  return { availableTabs, activeTab, setActiveTab };
}
