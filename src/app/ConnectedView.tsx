import { FC } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { jsx } from '@emotion/core';
import { BasicInfo } from './BasicInfo';
import { connectedView, tabLink, footer } from './styles';
import { useViews } from './useViews';
import { PiralDebugCapabilities } from '../types';

export interface ConnectedViewProps {
  capabilities: PiralDebugCapabilities;
}

export const ConnectedView: FC<ConnectedViewProps> = ({ capabilities }) => {
  const { availableTabs, activeTab, setActiveTab } = useViews(capabilities);

  return (
    <div css={connectedView}>
      <BasicInfo showSettings={capabilities.settings} />
      <Nav tabs>
        {availableTabs.map(tab => (
          <NavItem key={tab.id} css={tabLink}>
            <NavLink className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              {tab.title}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {availableTabs.map(tab => (
          <TabPane key={tab.id} tabId={tab.id}>
            <tab.Content active={activeTab === tab.id} />
          </TabPane>
        ))}
      </TabContent>
      <div css={footer}>
        Piral Inspector v0.9.0
      </div>
    </div>
  );
};
