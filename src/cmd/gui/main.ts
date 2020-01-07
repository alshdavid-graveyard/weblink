import weblink from '~/platform/browser-io'

void async function main() {
  const worker = new Worker('/worker.js');
  const bus = weblink.fromWindow()

  bus.onConnection.subscribe(c => {
    c.onMessage.subscribe(console.log)
    c.send('Yo')
  })

  weblink.connectToWorker(bus, worker)
}()
