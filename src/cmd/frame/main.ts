import { browserIO } from '~/platform/browser-io'

void async function main() {
  const bus = new browserIO.Bus({
    targetOrigin: '*',
    eventSource: window,
    postMessage: window.postMessage,
    channelConstructor: window.MessageChannel,
  })

  window.postMessage
  bus.onConnection.subscribe(c => {
    console.log('frame received', c)
  })

  bus.connect({
    bus: window.parent,
    selfListener: window
  })
}()