import { FC, Fragment, useEffect } from 'react';
import { jsx, Global } from '@emotion/core';
import { StoreApi } from 'zustand';
import { View } from './View';
import { globalView } from './styles';
import { Store, store } from './store';

function useSyncedStore(localApi: StoreApi<Store>) {
  useEffect(() => {
    let dispose = () => window.removeEventListener('pi-store', handler);
    const handler = (e: CustomEvent<typeof store>) => {
      const [_, remoteApi] = e.detail;
      localApi.setState(remoteApi.getState);
      dispose();
      dispose = remoteApi.subscribe<Store>(state => localApi.setState(state));
    };
    window.addEventListener('pi-store', handler);
    return () => dispose();
  }, []);
}

export interface AppProps {}

export const App: FC<AppProps> = () => {
  useSyncedStore(store[1]);

  return (
    <Fragment>
      <Global styles={globalView} />
      <View />
    </Fragment>
  );
};
