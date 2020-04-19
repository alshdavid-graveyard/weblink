import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { strings } from '../../platform/strings';
import { connect } from './connect';
import { ChannelConstructor, ChannelEvent, EventListenerAdderRemover, getWindow, OriginPostMessenger } from './dom-types';
import { Message } from './message';
import { MessageType } from './message-type';
import { PortConnection } from './port-connection';
import { Connection, ConnectOptions, defaultID } from './types';

export interface WindowLinkOptions {
  selfEventSource: EventListenerAdderRemover;
  channelConstructor: ChannelConstructor;
  targetOrigin?: string;
  ID?: number;
}

export class WindowLink {
  public onConnection: Observable<Connection>;
  private onConnectionSubject = new Subject<Connection>();
  private connections: Record<string, Connection> = {};
  private onPostMessage: Subscription;

  constructor(
    private options: WindowLinkOptions,
  ) {
    this.onConnection = this.onConnectionSubject.asObservable();

    this.onPostMessage = fromEvent<ChannelEvent>(this.options.selfEventSource, 'message')
      .pipe(filter(this.handshakeFilter))
      .subscribe(this.handshake);
  }

  public destroy() {
    this.onPostMessage.unsubscribe();
  }

  public async connect(target: OriginPostMessenger, options: ConnectOptions = {}): Promise<Connection> {
    const connection = await connect({
      target,
      targetOrigin: this.options.targetOrigin || '*',
      selfEventSource: this.options.selfEventSource,
      ...options,
    });
    this.onConnectionSubject.next(connection);
    return connection;
  }

  private handshakeFilter = (event: ChannelEvent) => {
    return event.data.type === MessageType.READY_FOR_PORT
      && event.data.payload.ID === (this.options.ID || defaultID);
  }

  private handshake = async (event: any) => {
    const connectionID: string = strings.random(20);

    const channel = new this.options.channelConstructor();
    const { port1, port2 } = channel;

    const connection = new PortConnection(port1);

    if (event.source) {
      event.source.postMessage(
        new Message(MessageType.PORT_TRANSFER),
        this.options.targetOrigin,
        [port2],
      );
    } else {
      ;(this.options.selfEventSource as any).postMessage(
        new Message(MessageType.PORT_TRANSFER),
        [port2]
      )
    }


    await connection.onReady;

    this.connections[connectionID] = connection;
    this.onConnectionSubject.next(connection);

    port1.postMessage(new Message(MessageType.LISTENING, { id: connection.id }));
  }
}

export type CreateOptions = {
  targetOrigin?: string
  window?: any,
};

export const create = ({
  targetOrigin = '*',
  window = getWindow(),
}: CreateOptions = {}) => new WindowLink({
  targetOrigin,
  ID: 80,
  selfEventSource: window,
  channelConstructor: window.MessageChannel,
});
