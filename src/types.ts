export type PiWorkerMessage = PiWorkerAvailable | PiWorkerUnavailable;

export interface PiWorkerAvailable {
  type: 'available';
}

export interface PiWorkerUnavailable {
  type: 'unavailable';
}

export type PiHostMessage = PiHostIsAvailable;

export interface PiHostIsAvailable {
  type: 'is-available';
}
