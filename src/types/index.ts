export type PiWorkerMessage =
  | PiWorkerAvailable
  | PiWorkerUnavailable
  | PiWorkerResult
  | PiWorkerPilets
  | PiWorkerRoutes
  | PiWorkerSettings
  | PiWorkerEvents
  | PiWorkerContainer
  | PiWorkerReconnect;

export interface PiWorkerReconnect {
  type: 'cs-connect';
}

export interface PiralDebugCapabilities {
  events: boolean;
  container: boolean;
  routes: boolean;
  pilets: boolean;
  settings: boolean;
}

export interface PiralWorkerInitialState {
  container?: any;
  events?: Array<PiralEvent>;
  pilets?: Array<any>;
  routes?: Array<string>;
  settings?: PiralDebugSettings;
  [name: string]: any;
}

export interface PiWorkerAvailable {
  type: 'available';
  name: string;
  version: string;
  kind: 'v0' | 'v1';
  capabilities: Array<keyof PiralDebugCapabilities>;
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
  | PiHostVisualizeAll;

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
}

export interface PiHostInit {
  type: 'init';
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
