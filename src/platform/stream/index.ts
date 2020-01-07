import { Client } from './client';
import { Router } from './router';
import { StreamEvent } from './stream-event';

export const stream = {
  Router,
  Client,
  StreamEvent,
};

export default stream;

import * as client from './client';
import * as interfaces from './interfaces';
import * as router from './router';
import * as streamEvent from './stream-event';

export declare namespace stream {
  export type Router = router.Router;
  export type Client = client.Client;
  export type StreamEvent = streamEvent.StreamEvent;
  export type Context = interfaces.Context;
  export type ClientSendOptions = interfaces.ClientSendOptions;
  export type HandlerFunc = interfaces.HandlerFunc;
  export type EventSenderReceiver = interfaces.EventSenderReceiver;
}
