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

export interface PiWorkerAvailable {
  type: 'available';
  name: string;
  version: string;
  kind: 'v0' | 'v1';
  capabilities: Array<keyof PiralDebugCapabilities>;
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
  | PiHostAllInfos
  | PiHostCheckAvailable
  | PiHostRunQuery
  | PiHostGetSettings
  | PiHostRemovePilet
  | PiHostAppendPilet
  | PiHostTogglePilet
  | PiHostRunCommand
  | PiHostUpdateSettings
  | PiHostEmitEvent
  | PiHostVisualizeAll;

export type PiLegacyHostMessage = PiHostMessage | PiHostGetEvents | PiHostGetRoutes | PiHostGotoRoute | PiHostGetPilets;

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
  settings: PiralDebugSettings;
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

export interface PiHostGetEvents {
  type: 'get-events';
}

export interface PiHostInit {
  type: 'init';
}

export interface PiHostAllInfos {
  type: 'all-infos';
}

export interface PiHostGetPilets {
  type: 'get-pilets';
}

export interface PiHostGetSettings {
  type: 'get-settings';
}

export interface PiHostGetRoutes {
  type: 'get-routes';
}

export interface PiHostRunQuery {
  type: 'run-query';
  value: string;
  id: string;
}

export interface PiHostRunCommand {
  type: 'run-command';
  method: string;
  args: Array<any>;
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
