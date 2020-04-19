import { Subscribable } from 'rxjs';
import { WeblinkEvent } from './models/weblink-event';
import { WEBLINK_DEBUG, WEBLINK_DEBUG_READY } from './models/debug-event';
import { stdom } from '../stdom'

export type WeblinkExtension = {
  postMessage$: Subscribable<{ data: any }>,
  triggerWeblinkEvent: (data: WeblinkEvent) => void,
};

export const getExtension = (): Promise<WeblinkExtension> => new Promise(res => {
  let target: any
  if (stdom.ENVIRONMENT_IS_WORKER) {
    target = self
  } else {
    target = window
  }
  if (!!(target as any)[WEBLINK_DEBUG]) {
    res((target as any)[WEBLINK_DEBUG]);
  }
  const filterReady = (event: any) => {
    if (event.data.from === WEBLINK_DEBUG && event.data.type === WEBLINK_DEBUG_READY) {
      res((target as any)[WEBLINK_DEBUG])
    }
    target.removeEventListener('message', filterReady)
  }
  target.addEventListener('message', filterReady)
});

export const extension = {
  triggerWeblinkEvent: (data: WeblinkEvent) => getExtension().then(e => e.triggerWeblinkEvent(data))
};
