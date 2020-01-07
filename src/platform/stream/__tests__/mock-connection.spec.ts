import { first } from 'rxjs/operators';
import { createConnections } from './mock-connection';

it.concurrent('Should not preserve object reference', async () => {
  const { client, server } = createConnections();
  const msg = { foo: 'bar' };

  const onReceive = server.onMessage
    .pipe(first())
    .toPromise();

  client.send(msg);

  const received = await onReceive;

  expect(received).toEqual(msg);
  expect(received === msg).toBe(false);
});
