import { FC } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { jsx } from '@emotion/core';
import { BasicInfo } from './BasicInfo';
import { connectedView, tabLink, footer } from './styles';
import { useViews } from './useViews';
import { version } from '../../package.json';
import { PiralDebugCapabilities } from '../types';
import * as React from 'react';

export interface ConnectedViewProps {
  capabilities: PiralDebugCapabilities;
}

const navbarHeightBreakPoint = 45;
const getNavbarHeight = () => document.getElementById('piral-inspector-navbar')?.offsetHeight || 0;

export const ConnectedView: FC<ConnectedViewProps> = ({ capabilities }) => {
  const { availableTabs, activeTab, setActiveTab } = useViews(capabilities);
  const [height, setHeight] = React.useState(0);
  const [vertical, setVertical] = React.useState(false);

  React.useEffect(() => {
    setHeight(getNavbarHeight());
    window.addEventListener(
      'resize',
      () => {
        setVertical(false);
        setHeight(getNavbarHeight());
      },
      false,
    );
  }, []);

  React.useEffect(() => {
    const needsToBeVertical = height > navbarHeightBreakPoint;
    if (!needsToBeVertical) return;

    setVertical(true);
  }, [height, vertical]);

  return (
    <div css={connectedView}>
      <BasicInfo showSettings={capabilities.settings} />
      <Nav id="piral-inspector-navbar" tabs vertical={vertical}>
        {availableTabs.map((tab) => (
          <NavItem key={tab.id} css={tabLink}>
            <NavLink className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              {tab.title}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {availableTabs.map((tab) => (
          <TabPane key={tab.id} tabId={tab.id}>
            <tab.Content active={activeTab === tab.id} />
          </TabPane>
        ))}
      </TabContent>
      <div css={footer}>Piral Inspector v{version}</div>
    </div>
  );
};
