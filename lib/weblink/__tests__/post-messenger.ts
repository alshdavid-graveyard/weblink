import { EventListener } from './event-listener';
import { MockPort } from './message-port';

export class MockPostMessenger {
  public listener = new EventListener();

  get addEventListener() {
    return this.listener.addEventListener.bind(this.listener);
  }

  get removeEventListener() {
    return this.listener.removeEventListener.bind(this.listener);
  }

  private postMessengers: MockPostMessenger[] = [];

  constructor(
    public name: string = '',
  ) {}

  public addEventSource(pm: MockPostMessenger) {
    this.postMessengers.push(pm)
  }

  public postMessage(msg: any, _origin: string, transferable: Array<any> = []) {
    if (transferable[0] && transferable[0] instanceof MockPort) {
      transferable[0].hasStarted = false;
      transferable[0].buffer = [];

    }
    this.listener.triggerRaw({
      data: msg,
      ports: transferable,
      source: this
    })
    for (const postMessenger of this.postMessengers) {
      this.listener.triggerRaw({
        data: msg,
        ports: transferable,
        source: postMessenger,
      });
    }
  }
}
