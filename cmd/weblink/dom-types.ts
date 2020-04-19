export const getWindow = (): Window => window;

export interface ChannelPort extends
  PostMessenger,
  EventListenerAdder,
  EventListenerRemover,
  Starter,
  Closer { }

export interface Channel {
  port1: ChannelPort;
  port2: ChannelPort;
}

export type ChannelConstructor = new () => Channel;

export interface ChannelEvent {
  data: any;
  source?: OriginPostMessenger;
  ports?: Array<ChannelPort>;
  currentTarget?: PostMessenger;
}

export interface EventListenerAdderRemover extends
  EventListenerAdder,
  EventListenerRemover { }

export interface EventListenerAdder {
  addEventListener(event: string, callback: any): void;
}

export interface EventListenerRemover {
  removeEventListener(event: string, callback: any): void;
}

export interface Starter {
  start(): void;
}

export interface Closer {
  close(): void;
}

export interface PostMessenger {
  postMessage(message: any, transfer?: Array<any>): void;
}

export interface OriginPostMessenger {
  postMessage(message: any, targetOrigin?: string, transfer?: Array<any>): void;
}