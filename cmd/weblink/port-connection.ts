import { fromEvent, Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Message } from './message';
import { MessageType } from './message-type';
import { ChannelEvent, ChannelPort, Connection } from './types';

export class PortConnection implements Connection {
  public onMessage: Observable<any>;
  public onReady: Promise<void>;
  private onEvent: Observable<ChannelEvent>;

  constructor(
    private port: ChannelPort,
  ) {
    this.onEvent = fromEvent(this.port, 'message');
    this.onReady = this.onEvent
      .pipe(first(portEvent => portEvent.data.type === MessageType.LISTENING))
      .toPromise()
      .then(() => { /* ts-ignore */});

    this.onMessage = this.onEvent
      .pipe(
        filter(event => event.data.type === MessageType.DATA),
        map(event => event.data.payload),
      );

    this.port.start();
  }

  public send(data: any) {
    this.dispatch(data);
  }

  private async dispatch(data?: any) {
    await this.onReady;
    const msg = new Message(MessageType.DATA, data);
    this.port.postMessage(msg);
  }
}
