import { fromEvent, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { sleep } from '../sleep';
import { Connection } from './connection';
import { ChannelEvent, ChannelPort, EventListenerAdderRemover, OriginPostMessenger, defaultBrokerID } from './interfaces';
import { Message } from './message';
import { MessageType } from './message-type';

export interface ClientOptions {
  bus: OriginPostMessenger;
  retryTimeout?: number;
  selfListener: EventListenerAdderRemover;
  brokerID?: number;
}

export class Client {
  public onConnection = new ReplaySubject<Connection>(1);
  private port2: ChannelPort | undefined;
  private broker: OriginPostMessenger;
  private retryTimeout: number;
  private selfListener: EventListenerAdderRemover;
  private brokerID: number = defaultBrokerID

  constructor(options: ClientOptions) {
    this.broker = options.bus;
    this.retryTimeout = options.retryTimeout || 100;
    this.selfListener = options.selfListener;
    this.brokerID = options.brokerID || this.brokerID;
    this.handshake();
  }

  private async handshake() {
    const onEvent = fromEvent<ChannelEvent>(this.selfListener, 'message')
      .pipe(first(postMessageEvent => postMessageEvent.data.type === MessageType.PORT_TRANSFER))
      .toPromise();

    setTimeout(async () => {
      while (this.port2 === undefined) {
        this.broker.postMessage(
          new Message(MessageType.READY_FOR_PORT, { ID: this.brokerID }),
        );
        await sleep.duration(this.retryTimeout);
      }
    }, 0);

    const event = await onEvent;
    this.port2 = event.ports![0];

    const connection = new Connection(this.port2);

    this.onConnection.next(connection);

    this.port2.postMessage(new Message(MessageType.LISTENING));
  }
}
