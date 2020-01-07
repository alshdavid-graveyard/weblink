import weblink from '~/platform/weblink'

void async function main() {
  const bus = weblink.fromWorker()

  bus.onConnection.subscribe(c => {
    c.onMessage.subscribe(console.warn)
    c.send('Hey')
  })
}()

