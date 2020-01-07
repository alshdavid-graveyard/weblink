import { fromEvent, Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { ChannelEvent, ChannelPort } from './interfaces';
import { Message } from './message';
import { MessageType } from './message-type';

export class Connection {
  public onMessage: Observable<any>;
  public isReady: Promise<any>;
  private onEvent: Observable<ChannelEvent>;

  constructor(
    private port: ChannelPort,
  ) {
    this.onEvent = fromEvent(this.port, 'message');
    this.isReady = this.onEvent
      .pipe(first(portEvent => portEvent.data.type === MessageType.LISTENING))
      .toPromise();
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
    await this.isReady;
    const msg = new Message(MessageType.DATA, data);
    this.port.postMessage(msg);
  }
}
