import { PiHostMessage, PiletMetadata } from '../types';

function emit(detail: PiHostMessage) {
  const ev = new CustomEvent('pi-send-request', {
    detail,
  });
  window.dispatchEvent(ev);
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
