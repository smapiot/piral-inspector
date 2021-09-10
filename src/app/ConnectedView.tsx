import { FC } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { jsx } from '@emotion/core';
import { BasicInfo } from './BasicInfo';
import { connectedView, tabLink } from './styles';
import { PiralDebugCapabilities } from '../types';
import { useViews } from './useViews';

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
            <NavLink className={activeTab === tab.id && 'active'} onClick={() => setActiveTab(tab.id)}>
              {tab.title}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {availableTabs.map(tab => (
          <TabPane key={tab.id} tabId={tab.id}>
            {tab.content}
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
};
