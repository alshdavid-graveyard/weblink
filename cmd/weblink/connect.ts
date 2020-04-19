import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';
import { time } from '../../platform/time';
import { Message } from './message';
import { MessageType } from './message-type';
import { PortConnection } from './port-connection';
import { ChannelEvent, ChannelPort, Connection, defaultID, EventListenerAdderRemover, OriginPostMessenger } from './types';

export interface ConnectOptions {
  target: OriginPostMessenger;
  targetID?: number;
  targetOrigin: string;
  selfEventSource: EventListenerAdderRemover;
  retryTimeout?: time.Duration;
}

export const connect = async ({
  target,
  targetID = defaultID,
  targetOrigin = '*',
  selfEventSource,
  retryTimeout = time.second,
}: ConnectOptions): Promise<Connection> => {
  const onEvent = fromEvent<ChannelEvent>(selfEventSource, 'message')
    .pipe(first(postMessageEvent => postMessageEvent.data.type === MessageType.PORT_TRANSFER))
    .toPromise();

  let port2: ChannelPort | undefined;

  setTimeout(async () => {
    while (port2 === undefined) {
      target.postMessage(
        new Message(MessageType.READY_FOR_PORT, { ID: targetID }),
        targetOrigin,
      );
      await time.sleep(retryTimeout);
    }
  }, 0);

  const event = await onEvent;
  port2 = event.ports![0];

  const connection = new PortConnection(port2);

  port2.postMessage(new Message(MessageType.LISTENING));

  return connection;
};
