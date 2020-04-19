export * from './dom-types';
import { Observable } from 'rxjs';
import { OriginPostMessenger } from './dom-types';

export const defaultID = 80;

export type Linker = (
  ConnectionListener
);

export interface ConnectionListener {
  onConnection: Observable<MessageListener & Sender>;
}

export interface MessageListener<T = any> {
  onMessage: Observable<T>;
}

export interface ReadyListener {
  onReady: Promise<void>;
}

export interface Sender<T = any> {
  send(data: T): void;
}

export interface Destroyer {
  destroy(): void;
}

export interface ConnectOptions {
  targetID?: number;
  targetOrigin?: string;
  retryTimeout?: number;
}

export interface Connector {
  connect(options: ConnectOptions): Promise<Connection>;
}

export type Link = (
  ConnectionListener &
  Destroyer &
  Connector
);

export type Connection = (
  MessageListener &
  Sender &
  ReadyListener
);
