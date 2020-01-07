import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';
import { MockMessageChannel } from './message-channel';
import { MockPostMessenger } from './post-messenger';

it('Window: Should mock event listener', async (done) => {
  const hasRun = jest.fn();
  const mockWindow = new MockPostMessenger();

  mockWindow.addEventListener('message', () => {
    hasRun();
    expect(hasRun).toBeCalledTimes(1);
    done();
  });
  mockWindow.postMessage('Hi', '*');
});

it('Window: Should reset transfered ports', async (done) => {
  const mockWindow = new MockPostMessenger();
  const channel = new MockMessageChannel();
  const { port2 } = channel;

  port2.start();

  const onMessage = (event: any ) => {
    expect(event.ports[0].hasStarted).toBe(false);
    mockWindow.removeEventListener('message', onMessage);
    done();
  };

  mockWindow.addEventListener('message', onMessage);
  mockWindow.postMessage('SEND_PORT', '*', [port2]);
});

it('Window: Should support rxjs fromEvent', async () => {
  const mockWindow = new MockPostMessenger();
  const onEvent = fromEvent(mockWindow, 'message')
    .pipe(first())
    .toPromise();
  mockWindow.postMessage('Hi', '*');
  const value: any = await onEvent;
  expect(value.data).toEqual('Hi');
});
