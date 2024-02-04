import { create } from 'zustand';
import { getTheme } from './utils';
import { PiralDebugCapabilities, PiralDebugSettings, PiralEvent, PiralWorkerInitialState } from '../types';

export type DependencyRelation = { demanded: string; resolved: string };

export type Dependencies = Array<DependencyRelation>;

export type DependencyMap = Record<string, Array<string | DependencyRelation>>;

export interface StoreState {
  connected: boolean;
  theme: string;
  name?: string;
  version?: string;
  kind?: string;
  pilets?: Array<{
    name: string;
    version: string;
    disabled?: boolean;
  }>;
  routes?: Array<string>;
  extensions?: Array<string>;
  events?: Array<PiralEvent>;
  container?: any;
  dependencyMap?: DependencyMap;
  settings?: PiralDebugSettings;
  capabilities?: PiralDebugCapabilities;
}

export interface StoreActions {
  connect(
    name: string,
    version: string,
    kind: string,
    capabilities: Array<string>,
    state: PiralWorkerInitialState,
  ): void;
  disconnect(): void;
  toggleTheme(): void;
  updatePilets(pilets: Array<any>): void;
  updateRoutes(routes: Array<string>): void;
  updateSettings(settings: PiralDebugSettings): void;
  updateEvents(events: Array<PiralEvent>): void;
  updateContainer(container: any): void;
  updateInfo(name: string, version: string, kind: string, capabilities: Array<string>): void;
  updateDependencyMap(dependencyMap: Record<string, Array<string>>): void;
  updateExtensions(extensions: Array<string>): void;
}

export interface Store {
  state: StoreState;
  actions: StoreActions;
}

function dispatch(set: (update: (state: Store) => Store) => void, update: (state: StoreState) => Partial<StoreState>) {
  set((store) => ({
    ...store,
    state: {
      ...store.state,
      ...update(store.state),
    },
  }));
}

function compareDependencyMap(oldMap: DependencyMap, newMap: DependencyMap) {
  const oldKeys = Object.keys(oldMap);
  const newKeys = Object.keys(newMap);

  if (oldKeys.length === newKeys.length) {
    for (const key of oldKeys) {
      if (!newKeys.includes(key)) {
        return newMap;
      }

      const oldPiletDeps = oldMap[key];
      const newPiletDeps = newMap[key];

      if (oldPiletDeps.length !== newPiletDeps.length) {
        return newMap;
      }

      for (let i = 0; i < oldPiletDeps.length; i++) {
        const oldDep = oldPiletDeps[i];
        const newDep = newPiletDeps[i];

        if (typeof oldDep !== typeof newDep) {
          return newMap;
        } else if (typeof oldDep === 'string' || typeof newDep === 'string') {
          if (oldDep !== newDep) {
            return newMap;
          }
        } else if (oldDep.resolved !== newDep.resolved || oldDep.demanded !== newDep.demanded) {
          return newMap;
        }
      }
    }

    return oldMap;
  }

  return newMap;
}

export const useStore = create<Store>((set) => ({
  state: {
    connected: false,
    theme: getTheme(),
  },
  actions: {
    connect(name, version, kind, capabilities, state) {
      dispatch(set, () => ({
        events: [],
        pilets: [],
        routes: [],
        extensions: [],
        container: {},
        settings: {},
        dependencyMap: {},
        ...state,
        connected: true,
        name,
        version,
        kind,
        capabilities: {
          container: capabilities.includes('container'),
          events: capabilities.includes('events'),
          pilets: capabilities.includes('pilets'),
          routes: capabilities.includes('routes'),
          settings: capabilities.includes('settings'),
          extensions: capabilities.includes('extensions'),
          dependencies: capabilities.includes('dependencies'),
          'dependency-map': capabilities.includes('dependency-map'),
        },
      }));
    },
    disconnect() {
      dispatch(set, () => ({
        connected: false,
      }));
    },
    updateInfo(name, version, kind, capabilities) {
      dispatch(set, () => ({
        name,
        version,
        kind,
        capabilities: {
          container: capabilities.includes('container'),
          events: capabilities.includes('events'),
          pilets: capabilities.includes('pilets'),
          routes: capabilities.includes('routes'),
          settings: capabilities.includes('settings'),
          extensions: capabilities.includes('extensions'),
          dependencies: capabilities.includes('dependencies'),
          'dependency-map': capabilities.includes('dependency-map'),
        },
      }));
    },
    updateDependencyMap(dependencyMap) {
      dispatch(set, (state) => ({
        dependencyMap: compareDependencyMap(state.dependencyMap, dependencyMap),
      }));
    },
    toggleTheme() {
      dispatch(set, (state) => {
        const theme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        return {
          theme,
        };
      });
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
    updateExtensions(extensions) {
      dispatch(set, () => ({
        extensions,
      }));
    },
  },
}));
