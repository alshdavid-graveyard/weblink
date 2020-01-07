import { browserIO } from '~/platform/browser-io'

void async function main() {
  const bus = new browserIO.Bus({
    targetOrigin: '*',
    window: window,
    channelConstructor: window.MessageChannel,
  })

  bus.onConnection.subscribe(c => {
    console.log('client received', c)
  })
}()