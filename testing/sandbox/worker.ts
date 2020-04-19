import { weblink } from '@alshdavid/weblink'
import { stdom } from '~/platform/stdom'

const to = 'worker'

self.addEventListener('message', console.log)

const link = new weblink.WindowLink({
  targetOrigin: '*',
  ID: 80,
  selfEventSource: self,
  channelConstructor: MessageChannel,
})

link.onConnection.subscribe(conn => {
  conn.onMessage.subscribe(msg => console.log({ to, msg }))
  conn.send('Polo!')
})

link.connect(self)