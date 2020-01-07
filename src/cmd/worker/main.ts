import { browserIO } from '~/platform/browser-io'

void async function main() {
  const bus = browserIO.fromWorker()

  bus.onConnection.subscribe(c => {
    c.onMessage.subscribe(console.warn)
    c.send('Hey')
  })
}()

