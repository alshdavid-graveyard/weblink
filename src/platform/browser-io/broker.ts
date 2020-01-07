import { fromEvent, Subject, Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import RandomString from '../random-string';
import { Connection } from './connection';
import { ChannelConstructor, ChannelEvent, EventListenerAdderRemover, defaultBrokerID, PostMessenger, OriginPostMessenger } from './interfaces';
import { Message } from './message';
import { MessageType } from './message-type';
import { Client, ClientOptions } from './client';

// interface PostMessanger {
//   postMessage(message: any, targetOrigin: string, transfer?: Array<any>): void;
//   postMessage(message: any, transfer?: Array<any>): void;
// }

export interface BusOptions {
  targetOrigin: string;
  eventSource: EventListenerAdderRemover;
  postMessage: PostMessenger['postMessage'] | OriginPostMessenger['postMessage'];
  channelConstructor: ChannelConstructor;
  ID?: number
}

export class Bus {
  public onConnection: Observable<Connection>;
  private onConnectionSubject = new Subject<Connection>();
  private connections: Record<string, Connection> = {};
  private onPostMessage: Subscription;
  private eventSource: EventListenerAdderRemover;
  private channelConstructor: ChannelConstructor;
  private targetOrigin: string;
  private ID: number = defaultBrokerID

  constructor(
    private options: BusOptions
  ) {
    this.onConnection = this.onConnectionSubject.asObservable();
    this.eventSource = options.eventSource;
    this.channelConstructor = options.channelConstructor;
    this.targetOrigin = options.targetOrigin;
    this.ID = options.ID || this.ID

    this.onPostMessage = fromEvent<ChannelEvent>(this.eventSource, 'message')
      .pipe(filter(this.handshakeFilter))
      .subscribe(this.handshake);
  }

  public destroy() {
    this.onPostMessage.unsubscribe();
  }

  public connect(options: ClientOptions) {
    const client = new Client(options)
    const $ = client.onConnection.subscribe(c => {
      this.onConnectionSubject.next(c)
      $.unsubscribe()
    })
  }

  private handshakeFilter = (event: ChannelEvent) => {
    if (
      event.data.type === MessageType.READY_FOR_PORT &&
      event.data.payload.ID === this.ID
      ) {
      return true
    }
    return false
  }

  private handshake = async (event: ChannelEvent) => {
    const connectionID: string = RandomString.ofLength(20);

    const channel = new this.channelConstructor();
    const { port1, port2 } = channel;

    const connection = new Connection(port1);

    if (event.source) {
      event.source.postMessage(
        new Message(MessageType.PORT_TRANSFER),
        this.targetOrigin, [port2],
      );
    } else {
      ;(this.options.postMessage as PostMessenger['postMessage'])(
        new Message(MessageType.PORT_TRANSFER),
        [port2]
      )
    }

    await connection.isReady;

    this.connections[connectionID] = connection;
    this.onConnectionSubject.next(connection);

    port1.postMessage(new Message(MessageType.LISTENING));
  }

}
