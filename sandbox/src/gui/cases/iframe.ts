// import { browserIO } from '~/platform/browser-io'

// void async function main() {
//   const bus = new messageBroker.Bus({
//     targetOrigin: '*',
//     window: window,
//     channelConstructor: window.MessageChannel,
//     ID: messageBroker.defaultBrokerID
//   })

//   bus.onConnection.subscribe(c => {
//     console.log('index received', c)
//   })

//   const clientFrame = document.getElementById('client') as HTMLIFrameElement
//   if (!clientFrame) {
//     return
//   }
//   await new Promise(res => clientFrame.onload = (e) => res(e))

//   bus.connect({
//     bus: clientFrame.contentWindow
//   })
// }()