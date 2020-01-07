import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventSenderReceiver } from '../interfaces';

const transfer = (v: Record<string, any>) => JSON.parse(JSON.stringify(v));

export class MockConnection implements EventSenderReceiver {
  constructor(
    public onMessage: Observable<any>,
    public receiver: Subject<any>,
  ) {}

  public send(data: any) {
    this.receiver.next(data);
  }
}

export const createConnections = () => {
  const serverMessageBus = new Subject<any>();
  const clientMessageBus = new Subject<any>();

  const server = new MockConnection(
    clientMessageBus.pipe(map(transfer)),
    serverMessageBus,
  );

  const client = new MockConnection(
    serverMessageBus.pipe(map(transfer)),
    clientMessageBus,
  );

  return {
    server,
    client,
  };
};
