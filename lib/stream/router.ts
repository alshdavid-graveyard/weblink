import { Subscription } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { HandlerContext } from './handler-context';
import { EventSenderReceiver, HandlerFunc } from './interfaces';
import { InternalMessages } from './internal';
import { PreflightEvent } from './preflight-event';
import { StreamEvent } from './stream-event';

export class Router {
  private subscriptions = new Subscription();

  constructor(
    private connection: EventSenderReceiver<StreamEvent>,
  ) {
    const internal = this.connection.onMessage
      .pipe(first(req => req.eventType === InternalMessages.Preflight))
      .subscribe(() => this.connection.send(new PreflightEvent()));
    this.subscriptions.add(internal);
  }

  public on(eventType: string, cb: HandlerFunc): void {
    const sub = this.connection.onMessage
      .pipe(
        filter((req: StreamEvent) => req.eventType === eventType),
        map(req => new HandlerContext(this.connection, req)),
      )
      .subscribe(cb);
    this.subscriptions.add(sub);
  }

  public destroy(): void {
    this.subscriptions.unsubscribe();
  }
}
