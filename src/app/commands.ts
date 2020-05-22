import { PiHostMessage, PiletMetadata, PiralDebugSettings } from '../types';

function emit(detail: PiHostMessage) {
  const ev = new CustomEvent('pi-send-request', {
    detail,
  });
  window.dispatchEvent(ev);
}

export function initialize() {
  triggerPiletUpdate();
  triggerRouteUpdate();
  triggerSettingsUpdate();
  triggerEventsUpdate();
}

export function triggerEventsUpdate() {
  emit({
    type: 'get-events',
  });
}

export function triggerSettingsUpdate() {
  emit({
    type: 'get-settings',
  });
}

export function triggerPiletUpdate() {
  emit({
    type: 'get-pilets',
  });
}

export function triggerRouteUpdate() {
  emit({
    type: 'get-routes',
  });
}

export function goToRoute(route: string) {
  emit({
    type: 'goto-route',
    route,
  });
}

export function removePilet(name: string) {
  emit({
    type: 'remove-pilet',
    name,
  });
}

export function appendPilet(meta: PiletMetadata) {
  emit({
    type: 'append-pilet',
    meta,
  });
}

export function togglePilet(name: string) {
  emit({
    type: 'toggle-pilet',
    name,
  })
}

export function updateSettings(settings: PiralDebugSettings) {
  emit({
    type: 'update-settings',
    settings,
  });
}

export function emitEvent(name: string, args: any) {
  emit({
    type: 'emit-event',
    name,
    args,
  });
}
