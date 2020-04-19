import { weblink } from '@alshdavid/weblink'
import { stdom } from '~/platform/stdom'

const to = 'home'

export const loadWorker = async () => { 
  const worker = new Worker('./worker', { type: 'module' })

  const link = new weblink.WindowLink({
    targetOrigin: '*',
    ID: 80,
    selfEventSource: worker,
    channelConstructor: window.MessageChannel,
  })

  link.onConnection.subscribe(conn => {
    console.log('connected')
    conn.onMessage.subscribe(msg => console.log({ to, msg }))
    conn.send('Marco!')
  })

  // link.connect(worker as any)
}