export type PiWorkerMessage =
  | PiWorkerAvailable
  | PiWorkerUnavailable
  | PiWorkerResult
  | PiWorkerPilets
  | PiWorkerRoutes
  | PiWorkerSettings
  | PiWorkerEvents
  | PiWorkerExtensions
  | PiWorkerContainer
  | PiWorkerReconnect
  | PiWorkerInfo
  | PiWorkerDependencyMap;

export interface PiWorkerReconnect {
  type: 'cs-connect';
}

export interface PiralDebugCapabilities {
  events: boolean;
  container: boolean;
  routes: boolean;
  pilets: boolean;
  settings: boolean;
  extensions: boolean;
  dependencies: boolean;
  'dependency-map': boolean;
}

export interface PiralWorkerInitialState {
  container?: any;
  events?: Array<PiralEvent>;
  pilets?: Array<{
    name: string;
    version: string;
    disabled?: boolean;
  }>;
  routes?: Array<string>;
  settings?: PiralDebugSettings;
  extensions?: Array<string>;
  [name: string]: any;
}

export interface BaseWorkerDetails {
  name: string;
  version: string;
  kind: 'v0' | 'v1';
  mode: 'production' | 'development';
  capabilities: Array<keyof PiralDebugCapabilities>;
}

export interface PiWorkerInfo extends BaseWorkerDetails {
  type: 'info';
}

export interface PiWorkerDependencyMap {
  type: 'dependency-map';
  dependencyMap: Record<string, Array<string>>;
}

export interface PiWorkerAvailable extends BaseWorkerDetails {
  type: 'available';
  state: PiralWorkerInitialState;
}

export interface PiWorkerEvents {
  type: 'events';
  events: Array<PiralEvent>;
}

export interface PiWorkerContainer {
  type: 'container';
  container: any;
}

export interface PiWorkerExtensions {
  type: 'extensions';
  extensions: Array<string>;
}

export interface PiWorkerUnavailable {
  type: 'unavailable';
}

export interface PiWorkerResult {
  type: 'result';
  result: any;
  id: string;
}

export interface PiWorkerPilets {
  type: 'pilets';
  pilets: Array<any>;
}

export interface PiWorkerRoutes {
  type: 'routes';
  routes: Array<string>;
}

export interface PiWorkerSettings {
  type: 'settings';
  settings: PiralDebugSettings;
}

export interface PiralEvent {
  id: string;
  name: string;
  time: number;
  args: any;
}

export interface PiralDebugSettings {
  [name: string]: {
    value: any;
    label: string;
    type: 'boolean' | 'string' | 'number';
  };
}

export interface PiletMetadata {
  name: string;
  version: string;
  link?: string;
  spec?: string;
  content?: string;
  custom?: any;
  hash?: string;
}

export type PiHostMessage =
  | PiHostInit
  | PiHostCheckAvailable
  | PiHostGotoRoute
  | PiHostRemovePilet
  | PiHostAppendPilet
  | PiHostTogglePilet
  | PiHostUpdateSettings
  | PiHostEmitEvent
  | PiHostVisualizeAll
  | PiHostGetDependencyMap
  | PiHostCheckPiral;

export interface PiHostEmitEvent {
  type: 'emit-event';
  name: string;
  args: any;
}

export interface PiHostVisualizeAll {
  type: 'visualize-all';
}

export interface PiHostUpdateSettings {
  type: 'update-settings';
  settings: Record<string, any>;
}

export interface PiHostRemovePilet {
  type: 'remove-pilet';
  name: string;
}

export interface PiHostAppendPilet {
  type: 'append-pilet';
  meta: PiletMetadata;
}

export interface PiHostTogglePilet {
  type: 'toggle-pilet';
  name: string;
}

export interface PiHostCheckAvailable {
  type: 'check-available';
}

export interface PiHostGotoRoute {
  type: 'goto-route';
  route: string;
  state?: any;
}

export interface PiHostInit {
  type: 'init';
}

export interface PiHostCheckPiral {
  type: 'check-piral';
}

export interface PiHostGetDependencyMap {
  type: 'get-dependency-map';
}

export interface PiralDebugApiMessage {
  source: 'piral-debug-api';
  version: 'v1';
  content: any;
}

export interface PiralInspectorMessage {
  source: 'piral-inspector';
  version: 'v1';
  content: any;
}

declare global {
  interface Window {
    sendCommand(message: PiHostMessage): void;
  }
}
