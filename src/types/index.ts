export type PiWorkerMessage =
  | PiWorkerAvailable
  | PiWorkerUnavailable
  | PiWorkerResult
  | PiWorkerPilets
  | PiWorkerRoutes;

export interface PiWorkerAvailable {
  type: 'available';
  name: string;
  version: string;
  kind: 'v0';
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
  | PiHostRunQuery
  | PiHostGetRoutes
  | PiHostGotoRoute
  | PiHostGetPilets
  | PiHostRemovePilet
  | PiHostAppendPilet
  | PiHostRunCommand;

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

export interface PiHostGetPilets {
  type: 'get-pilets';
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
