import { Transport } from '@alshdavid/weblink'

const transport = new Transport()

const log = (...args: any) => true && console.warn(...args)

if (window.location.search.includes('frame=a')) {
  const otherWindow = window.parent.frames[1]

  // transport.connect(otherWindow).then(conn => {
  //   conn.on('B=>A', () => log('B=>A'))
  //   conn.send('A=>B')
  // })
} else if (window.location.search.includes('frame=b')) {
  transport.onConnection(conn => {
    conn.on('A=>B', () => log('A=>B'))
    conn.on('C=>B', () => log('C=>B'))
    conn.send('B=>A')
  })

  const iframeC = document.createElement('iframe')
  iframeC.src = 'http://b.localhost:8082/frame?frame=c'
  document.body.appendChild(iframeC)

  iframeC.onload = async () => {
    const conn = await transport.connect(iframeC.contentWindow)
    conn.send('B=>C')
  }
} else if (window.location.search.includes('frame=c')) {
  transport.onConnection(conn => {
    conn.on('B=>C', () => log('B=>C'))
    conn.send('C=>B')
  })
}


// import { Transport } from '@alshdavid/weblink'

// const transport = new Transport()

// transport.connect(window.parent).then(conn => {
//   conn.on('MAIN_TO_XFRAME').subscribe(() => console.warn('MAIN_TO_XFRAME'))
//   conn.send('XFRAME_TO_MAIN')
// })

// transport.onConnection(conn => {
//   conn.send('XFRAME_TO_MAIN')
// })
