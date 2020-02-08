import create, { SetState } from 'zustand';

export interface StoreState {
  connected: boolean;
}

export interface StoreActions {
  initialize(connected: boolean): void;
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
    initialize(connected) {
      dispatch(set, () => ({
        connected,
      }));
    },
  },
}));

export { useStore };
