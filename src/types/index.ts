export type PiWorkerMessage =
  | PiWorkerAvailable
  | PiWorkerUnavailable
  | PiWorkerResult
  | PiWorkerPilets
  | PiWorkerRoutes
  | PiWorkerSettings
  | PiWorkerEvents;

export interface PiWorkerAvailable {
  type: 'available';
  name: string;
  version: string;
  kind: 'v0';
}

export interface PiWorkerEvents {
  type: 'events';
  events: Array<PiralEvent>;
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
  viewState: boolean;
  loadPilets: boolean;
  hardRefresh: boolean;
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
  | PiHostCheckAvailable
  | PiHostGetEvents
  | PiHostRunQuery
  | PiHostGetRoutes
  | PiHostGotoRoute
  | PiHostGetPilets
  | PiHostGetSettings
  | PiHostRemovePilet
  | PiHostAppendPilet
  | PiHostRunCommand
  | PiHostUpdateSettings
  | PiHostEmitEvent;

export interface PiHostEmitEvent {
  type: 'emit-event';
  name: string;
  args: any;
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
