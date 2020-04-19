import { weblink } from '@alshdavid/weblink'

const to = 'iframe'

export const iframe = () => {
  const link = weblink.create()

  link.onConnection.subscribe(conn => {
    conn.onMessage.subscribe(msg => console.log({ to, msg }))
    conn.send('Polo!')
  })
}