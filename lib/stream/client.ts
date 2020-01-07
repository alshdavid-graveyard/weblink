import { Subject } from 'rxjs';
import { first, timeout } from 'rxjs/operators';
import { RandomString } from '../random-string';
import { sleep } from '../sleep';
import { ErrorType } from './error-type';
import { ClientSendOptions, EventSenderReceiver } from './interfaces';
import { InternalMessages } from './internal';
import { PreflightEvent } from './preflight-event';
import { StreamEvent } from './stream-event';

export class Client {
  private preflightComplete = new Subject();

  constructor(
    private connection: EventSenderReceiver<StreamEvent>,
    public timeoutDuration: number = 10000,
  ) {
    this.preflight();
  }

  public async send(eventType: string, options: ClientSendOptions = {}): Promise<any> {
    await this.preflightComplete.toPromise();
    const ID = RandomString.ofLength(10);

    const response = this.connection.onMessage
      .pipe(
        first(req => req.ID === ID),
      )
      .toPromise()
      .then(res => {
        if (res.hasError === true) {
          throw new Error(res.payload);
        }
        return res.payload;
      });

    this.connection.send(new StreamEvent(ID, eventType, options.body));

    return response;
  }

  private async preflight() {
    let isReady = false;

    this.connection.onMessage
      .pipe(
        first(req => req.eventType === InternalMessages.Preflight),
        timeout(this.timeoutDuration),
      )
      .toPromise()
      .then(() => this.preflightComplete.complete())
      .catch(() => this.preflightComplete.error(new Error(ErrorType.Timeout)))
      .finally(() => isReady = true);

    while (isReady === false) {
      this.connection.send(new PreflightEvent());
      await sleep.duration(50);
    }
  }
}
