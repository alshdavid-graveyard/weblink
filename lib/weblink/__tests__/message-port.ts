import { Subject } from 'rxjs';
import { EventListener } from './event-listener';

export class MockPort {
  public onPostMessage = new Subject();
  public listener = new EventListener();
  public hasStarted = false;
  public hasClosed = false;
  public buffer: Array<any> = [];

  get addEventListener() {
    return this.listener.addEventListener.bind(this.listener);
  }

  get removeEventListener() {
    return this.listener.removeEventListener.bind(this.listener);
  }

  constructor(
    public meta?: any,
  ) {}

  public start() {
    this.hasStarted = true;
    for (const msg of this.buffer) {
      this.listener.trigger(msg);
    }
    this.buffer = [];
  }

  public close() {
    this.hasClosed = true;
  }

  public recieveMessage(msg: any) {
    if (this.hasClosed) {
      return;
    }
    if (this.hasStarted === false) {
      this.buffer.push(msg);
      return;
    }
    this.listener.trigger(msg);
  }

  public postMessage(msg: any) {
    this.onPostMessage.next(msg);
  }
}
