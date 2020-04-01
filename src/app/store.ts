import create, { SetState } from 'zustand';
import { triggerPiletUpdate, triggerRouteUpdate, triggerSettingsUpdate } from './commands';
import { PiralDebugSettings } from '../types';

export interface StoreState {
  connected: boolean;
  name?: string;
  version?: string;
  kind?: string;
  pilets?: Array<any>;
  routes?: Array<any>;
  settings?: PiralDebugSettings;
}

export interface StoreActions {
  connect(name: string, version: string, kind: string): void;
  disconnect(): void;
  updatePilets(pilets: Array<any>): void;
  updateRoutes(routes: Array<string>): void;
  updateSettings(settings: PiralDebugSettings): void;
}

export interface Store {
  state: StoreState;
  actions: StoreActions;
}

function dispatch(set: SetState<Store>, update: (state: StoreState) => Partial<StoreState>) {
  set(store => ({
    ...store,
    state: {
      ...store.state,
      ...update(store.state),
    },
  }));
}

const [useStore] = create<Store>(set => ({
  state: {
    connected: false,
  },
  actions: {
    connect(name, version, kind) {
      dispatch(set, () => ({
        connected: true,
        name,
        version,
        kind,
        pilets: [],
        routes: [],
        settings: {
          loadPilets: false,
          viewState: true,
        },
      }));
      triggerPiletUpdate();
      triggerRouteUpdate();
      triggerSettingsUpdate();
    },
    disconnect() {
      dispatch(set, () => ({
        connected: false,
      }));
    },
    updatePilets(pilets) {
      dispatch(set, () => ({
        pilets,
      }));
    },
    updateRoutes(routes) {
      routes.sort();
      dispatch(set, () => ({
        routes,
      }));
    },
    updateSettings(settings) {
      dispatch(set, () => ({
        settings,
      }));
    },
  },
}));

export { useStore };
