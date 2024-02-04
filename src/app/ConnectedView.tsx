import { jsx } from '@emotion/core';
import { FC, useState, useLayoutEffect } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { BasicInfo } from './BasicInfo';
import { connectedView, tabLink, footer } from './styles';
import { useViews } from './useViews';
import { version } from '../../package.json';
import { PiralDebugCapabilities } from '../types';

export interface ConnectedViewProps {
  capabilities: PiralDebugCapabilities;
}

function getNavbarWidth() {
  return document.getElementById('piral-inspector-navbar')?.offsetWidth || 0;
}

function useVerticalTabs() {
  const [vertical, setVertical] = useState(false);

  useLayoutEffect(() => {
    const handler = () => {
      const width = getNavbarWidth();
      setVertical(width < 576);
    };

    window.addEventListener('resize', handler, false);

    handler();

    return () => {
      window.removeEventListener('resize', handler, false);
    };
  }, []);

  return vertical;
}

export const ConnectedView: FC<ConnectedViewProps> = ({ capabilities }) => {
  const { availableTabs, activeTab, setActiveTab } = useViews(capabilities);
  const vertical = useVerticalTabs();

  return (
    <div css={connectedView}>
      <BasicInfo showSettings={capabilities.settings} />
      <Nav id="piral-inspector-navbar" tabs vertical={vertical} pills={vertical}>
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
