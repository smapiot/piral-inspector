import create, { SetState } from 'zustand';
import { initialize } from './commands';
import { PiralDebugSettings, PiralEvent } from '../types';

export interface StoreState {
  connected: boolean;
  name?: string;
  version?: string;
  kind?: string;
  pilets?: Array<any>;
  routes?: Array<any>;
  events?: Array<PiralEvent>;
  container?: any;
  settings?: PiralDebugSettings;
}

export interface StoreActions {
  connect(name: string, version: string, kind: string): void;
  disconnect(): void;
  updatePilets(pilets: Array<any>): void;
  updateRoutes(routes: Array<string>): void;
  updateSettings(settings: PiralDebugSettings): void;
  updateEvents(events: Array<PiralEvent>): void;
  updateContainer(container: any): void;
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
        events: [],
        pilets: [],
        routes: [],
        container: {},
        settings: {
          loadPilets: false,
          viewState: true,
          hardRefresh: false,
        },
      }));
      initialize();
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
    updateEvents(events) {
      dispatch(set, () => ({
        events,
      }));
    },
    updateContainer(container) {
      dispatch(set, () => ({
        container,
      }));
    },
  },
}));

export { useStore };
