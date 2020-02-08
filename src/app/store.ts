import create, { SetState } from 'zustand';
import { triggerPiletUpdate } from './commands';

export interface StoreState {
  connected: boolean;
  name?: string;
  version?: string;
  kind?: string;
  pilets?: Array<any>;
}

export interface StoreActions {
  connect(name: string, version: string, kind: string): void;
  disconnect(): void;
  update(pilets: Array<any>): void;
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
      }));
      triggerPiletUpdate();
    },
    disconnect() {
      dispatch(set, () => ({
        connected: false,
      }));
    },
    update(pilets) {
      dispatch(set, () => ({
        pilets,
      }));
    },
  },
}));

export { useStore };
