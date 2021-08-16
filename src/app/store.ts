import create, { SetState } from 'zustand';
import { PiralDebugCapabilities, PiralDebugSettings, PiralEvent } from '../types';

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
  capabilities?: PiralDebugCapabilities;
}

export interface StoreActions {
  connect(name: string, version: string, kind: string, capabilities: Array<string>): void;
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

export const store = create<Store>(set => ({
  state: {
    connected: false,
  },
  actions: {
    connect(name, version, kind, capabilities) {
      dispatch(set, () => ({
        connected: true,
        name,
        version,
        kind,
        events: [],
        pilets: [],
        routes: [],
        container: {},
        settings: {},
        capabilities: {
          container: capabilities.includes('container'),
          events: capabilities.includes('events'),
          pilets: capabilities.includes('pilets'),
          routes: capabilities.includes('routes'),
          settings: capabilities.includes('settings'),
        },
      }));
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

export const useStore = store[0];
