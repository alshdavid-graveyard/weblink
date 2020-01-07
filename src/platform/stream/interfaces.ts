import { Observable } from 'rxjs';

export interface EventSenderReceiver<T = any> extends
  EventReceiver<T>,
  EventSender<T> {}

export interface EventReceiver<T = any> {
  onMessage: Observable<T>;
}

export interface EventSender<T = any> {
  send(data: T): void;
}

export interface Context {
    getBody(): any;
    sendError(payload?: any): any;
    send(payload?: any): void;
}

export type HandlerFunc = (ctx: Context) => void;

export type ClientSendOptions = {
    body?: any,
};
