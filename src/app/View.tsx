import { FC } from 'react';
import { Button } from 'reactstrap';
import { jsx } from '@emotion/core';
import { ConnectedView } from './ConnectedView';
import { notConnectedView } from './styles';
import { useStore } from './store';

export interface ViewProps {}

export const View: FC<ViewProps> = () => {
  const { connected, capabilities } = useStore((m) => m.state);
  const actions = useStore((m) => m.actions);

  const currentTheme = useStore((m) => m.state.theme);
  const otherTheme = currentTheme === 'dark' ? 'light' : 'dark';

  return <div>ICH BIN HIER</div>;

  if (connected) {
    return <ConnectedView capabilities={capabilities} />;
  } else {
    return (
      <div css={notConnectedView}>
        <h2>Not connected</h2>
        <p>You are currently not running a Piral instance in debug mode.</p>
        <p>Note that you need to run Piral v0.10 or later on localhost for Piral Inspector to work.</p>
        <Button color="primary" onClick={actions.toggleTheme}>
          Switch to {otherTheme}
        </Button>
      </div>
    );
  }
};
