import { Transport } from '@alshdavid/weblink'

const transport = new Transport()

transport.onConnection(conn => {
  conn.on('MAIN_TO_WORKER', () => console.warn('MAIN_TO_WORKER'))

  conn.send('WORKER_TO_MAIN')

  setTimeout(() => {
    conn.send('WORKER_TO_MAIN')
  }, 2000)
})