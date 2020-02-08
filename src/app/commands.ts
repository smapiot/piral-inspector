import { PiHostMessage } from '../types';

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

export function removePilet(name: string) {
  emit({
    type: 'remove-pilet',
    name,
  });
}
