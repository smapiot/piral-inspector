import create, { SetState } from 'zustand';
import { initialize } from './commands';
import { PiralDebugSettings } from '../types';

export interface StoreState {
  connected: boolean;
  name?: string;
  version?: string;
  kind?: string;
  pilets?: Array<any>;
  routes?: Array<any>;
  events?: Array<{
    id: string;
    name: string;
    time: number;
    args: any;
  }>;
  settings?: PiralDebugSettings;
}

export interface StoreActions {
  connect(name: string, version: string, kind: string): void;
  disconnect(): void;
  updatePilets(pilets: Array<any>): void;
  updateRoutes(routes: Array<string>): void;
  updateSettings(settings: PiralDebugSettings): void;
  recordEvent(name: string, arg: any): void;
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
        settings: {
          loadPilets: false,
          viewState: true,
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
    recordEvent(name, args) {
      const time = Date.now();
      dispatch(set, state => ({
        events: [{ id: state.events.length.toString(), name, time, args }, ...state.events],
      }));
    },
  },
}));

export { useStore };
