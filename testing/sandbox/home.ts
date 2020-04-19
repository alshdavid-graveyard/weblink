import { weblink } from '@alshdavid/weblink'

const to = 'home'

export const home = async () => {
  const iframe = document.querySelector('iframe')!
  await new Promise(res => iframe.onload = res)

  const link = weblink.create()

  link.onConnection.subscribe(conn => {
    conn.onMessage.subscribe(msg => console.log({ to, msg }))
    conn.send('Marco!')
  })

  link.connect(iframe.contentWindow!)
}