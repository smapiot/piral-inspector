import { PiletMetadata } from '../types';

export function goToRoute(route: string, state?: any) {
  window.sendCommand({
    type: 'goto-route',
    route,
    state,
  });
}

export function removePilet(name: string) {
  window.sendCommand({
    type: 'remove-pilet',
    name,
  });
}

export function appendPilet(meta: PiletMetadata) {
  window.sendCommand({
    type: 'append-pilet',
    meta,
  });
}

export function togglePilet(name: string) {
  window.sendCommand({
    type: 'toggle-pilet',
    name,
  });
}

export function updateSettings(settings: Record<string, any>) {
  window.sendCommand({
    type: 'update-settings',
    settings,
  });
}

export function emitEvent(name: string, args: any) {
  window.sendCommand({
    type: 'emit-event',
    name,
    args,
  });
}

export function visualizeAll() {
  window.sendCommand({
    type: 'visualize-all',
  });
}
