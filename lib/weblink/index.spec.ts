// import { first } from 'rxjs/operators';
// import { MockMessageChannel, MockPostMessenger, Page } from './__tests__';
// import { messageBroker } from './index';

// const messageFromHost = 'Hi from host';
// const messageFromClient = 'Hi from client';

// it('Should connect to client', async (done) => {
//   const mockHostPage = new MockPostMessenger();
//   const mockClientPage = new MockPostMessenger();
//   mockHostPage.addEventSource(mockClientPage);
//   const host = new Page();
//   const frame = new Page();

//   host.script(async () => {
//     const broker = new messageBroker.Broker({
//       selfListener: mockHostPage,
//       Channel: MockMessageChannel,
//       targetOrigin: '*',
//     });

//     const connection = await broker.onConnection
//       .pipe(first())
//       .toPromise();

//     expect(connection).toBeTruthy();
//     broker.destroy();
//     done();
//   });

//   /* tslint:disable */
//   // TS lint thinks the client isn't used
//   frame.script(() => {
//     new messageBroker.Client({
//       broker: mockHostPage,
//       selfListener: mockClientPage,
//     });
//   });
//   /* tslint:enable */
// });

// it('Should send message to client', async (done) => {
//   const mockHostPage = new MockPostMessenger();
//   const mockClientPage = new MockPostMessenger();
//   mockHostPage.addEventSource(mockClientPage);

//   const host = new Page();
//   const frame = new Page();
//   let broker: messageBroker.Broker;

//   host.script(async () => {
//     broker = new messageBroker.Broker({
//       selfListener: mockHostPage,
//       Channel: MockMessageChannel,
//       targetOrigin: '*',
//     });

//     const connection = await broker.onConnection
//       .pipe(first()).toPromise();

//     connection.send(messageFromHost);
//   });

//   frame.script(async () => {
//     const client = new messageBroker.Client({
//       broker: mockHostPage,
//       selfListener: mockClientPage,
//     });

//     const connection = await client.onConnection
//       .pipe(first()).toPromise();

//     const msg = await connection.onMessage
//       .pipe(first()).toPromise();

//     expect(msg).toBe(messageFromHost);
//     broker.destroy();
//     done();
//   });
// });

// it('Should recieve message from client', async (done) => {
//   const mockHostPage = new MockPostMessenger();
//   const mockClientPage = new MockPostMessenger();
//   mockHostPage.addEventSource(mockClientPage);
//   const host = new Page();
//   const frame = new Page();

//   let broker: messageBroker.Broker;

//   host.script(async () => {
//     broker = new messageBroker.Broker({
//       targetOrigin: '*',
//       selfListener: mockHostPage,
//       Channel: MockMessageChannel,
//     });

//     const connection = await broker.onConnection
//       .pipe(first())
//       .toPromise();

//     const msg = await connection.onMessage
//       .pipe(first())
//       .toPromise();

//     expect(msg).toEqual(messageFromClient);
//     broker.destroy();
//     done();
//   });

//   frame.script(async () => {
//     const client = new messageBroker.Client({
//       broker: mockHostPage,
//       selfListener: mockClientPage,
//     });

//     const connection = await client.onConnection
//       .pipe(first()).toPromise();

//     connection.send(messageFromClient);
//   });
// });
