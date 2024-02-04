import { jsx, Global } from '@emotion/core';
import { FC, Fragment, useEffect } from 'react';
import { View } from './View';
import { globalViewLight, globalViewDark } from './styles';
import { useStore } from './store';

function useSyncedStore() {
  useEffect(() => {
    let dispose = () => window.removeEventListener('pi-store', handler);
    const handler = (e: CustomEvent<typeof useStore>) => {
      const useRemoteStore = e.detail;
      const syncState = useRemoteStore.getState();
      useStore.setState(syncState);
      dispose();
      dispose = useRemoteStore.subscribe((state) => {
        console.log('Setting new state', state);
        useStore.setState(state);
      });
    };
    window.addEventListener('pi-store', handler);
    return () => dispose();
  }, []);
}

function useIsDark() {
  const theme = useStore((m) => m.state.theme);
  return theme === 'dark';
}

function useStyles() {
  const dark = useIsDark();
  return dark ? globalViewDark : globalViewLight;
}

export interface AppProps {}

export const App: FC<AppProps> = () => {
  useSyncedStore();
  const styles = useStyles();

  return (
    <Fragment>
      <Global styles={styles} />
      <View />
    </Fragment>
  );
};
