import { Counter } from './counter';
import { MockMessageChannel } from './message-channel';

it('MessageChannel: emit once started', async (done) => {
  const channel = new MockMessageChannel();
  const { port1, port2 } = channel;

  port1.start();
  port2.start();

  const counter = new Counter(2, () => done());

  const port1Callback = (event: any) => {
    expect(event).toEqual({ data: 'From port 2'});
    port1.removeEventListener('message', port1Callback);
    counter.tick();
  };

  const port2Callback = (event: any) => {
    expect(event).toEqual({ data: 'From port 1'});
    port2.removeEventListener('message', port2Callback);
    counter.tick();
  };

  port1.addEventListener('message', port1Callback);
  port2.addEventListener('message', port2Callback);

  channel.port1.postMessage('From port 1');
  channel.port2.postMessage('From port 2');
});

it('MessageChannel: Should buffer message on unstarted port', async (done) => {
  const fn = jest.fn();
  const channel = new MockMessageChannel();
  const { port1, port2 } = channel;

  const counter = new Counter(2, () => {
    expect(fn).nthCalledWith(1, '1');
    expect(fn).nthCalledWith(2, '2');
    done();
  });

  const cb = (event: any) => {
    fn(event.data);
    counter.tick();
    if (counter.done) {
      port2.removeEventListener('message', cb);
    }
  };

  port2.addEventListener('message', cb);
  port1.postMessage('1');
  port1.postMessage('2');
  port2.start();
});

it('MessageChannel: Dont emit after closed', async () => {
  const channel = new MockMessageChannel();
  const { port2 } = channel;

  port2.start();
  port2.close();
  expect(port2.hasClosed).toEqual(true);
});
