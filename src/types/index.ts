export type PiWorkerMessage = PiWorkerAvailable | PiWorkerUnavailable | PiWorkerResult | PiWorkerPilets;

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

export type PiHostMessage =
  | PiHostCheckAvailable
  | PiHostRunQuery
  | PiHostGetPilets
  | PiHostRemovePilet
  | PiHostRunCommand;

export interface PiHostRemovePilet {
  type: 'remove-pilet';
  name: string;
}

export interface PiHostCheckAvailable {
  type: 'check-available';
}

export interface PiHostGetPilets {
  type: 'get-pilets';
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
