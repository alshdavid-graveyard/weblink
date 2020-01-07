import { createConnections } from './__tests__/mock-connection';
import { ErrorType } from './error-type';
import { stream } from './index';

it('Should send/receive request in async environment', async (done) => {
  const connections = createConnections();

  // Server
  setTimeout(() => {
    const router = new stream.Router(connections.server);
    router.on('EVENT', ctx => {
      expect(ctx.getBody()).toBe('marco');
      ctx.send('polo');
    });
  }, 1);

  // Client
  setTimeout(async () => {
    const client = new stream.Client(connections.client);
    const response = await client.send('EVENT', { body: 'marco' });
    expect(response).toBe('polo');
    done();
  }, 0);
});

it('Should generate exception in client when error occurs', async (done) => {
  const connections = createConnections();

  // Server
  setTimeout(() => {
    const router = new stream.Router(connections.server);
    router.on('EVENT', ctx => {
      expect(ctx.getBody()).toBe('marco');
      ctx.sendError('polo');
    });
  }, 1);

  // Client
  setTimeout(async () => {
    const client = new stream.Client(connections.client);
    try {
      await client.send('EVENT', { body: 'marco' });
    } catch (e) {
      expect((e as Error).message).toBe('polo');
      done();
    }
  }, 0);
});

it('Should throw on connection timeout', async (done) => {
  const connections = createConnections();
  try {
    const client = new stream.Client(connections.client, 0);
    await client.send('EVENT');
  } catch (e) {
    expect((e as Error)).toBeTruthy();
    expect((e as Error).message).toBe(ErrorType.Timeout);
    done();
  }
});
