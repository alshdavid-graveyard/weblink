import { MockPort } from './message-port';

export class MockMessageChannel {
  public port1 = new MockPort('port1');
  public port2 = new MockPort('port2');

  constructor() {
    this.port1.onPostMessage.subscribe(e => this.port2.recieveMessage(e));
    this.port2.onPostMessage.subscribe(e => this.port1.recieveMessage(e));
  }
}
