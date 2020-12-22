const iframeA = document.createElement('iframe')
iframeA.src = 'http://b.localhost:8082/frame?frame=a'
document.body.appendChild(iframeA)

const iframeB = document.createElement('iframe')
iframeB.src = 'http://b.localhost:8082/frame?frame=b'
document.body.appendChild(iframeB)


// // @ts-ignore
// import Worker from 'worker-loader?inline=no-fallback!./index.worker'
// import { Transport } from '@alshdavid/weblink'

// window.addEventListener('weblink-debug', (event: any) => console.warn(event.detail))

// const transport = new Transport()

// // Web worker
// void async function() {
//   const worker = new Worker()
//   const conn = await transport.connect(worker)

//   conn.on('WORKER_TO_MAIN', () => console.warn('WORKER_TO_MAIN'))
//   await conn.send('MAIN_TO_WORKER')
// }()



// // Cross origin iframe
// void async function() {
//   const iframe = document.createElement('iframe')
//   iframe.src = 'http://b.localhost:8082/frame?xframe=true'
//   document.body.appendChild(iframe)
  
//   await new Promise<void>(res => iframe.onload = () => res())
//   const conn = await transport.connect(iframe.contentWindow)
//   await conn.send('MAIN_TO_XFRAME')
// }

// // // Same origin iframe
// // void async function() {
// //   const iframe = document.createElement('iframe')
// //   iframe.src = 'http://localhost:8080/frame'
// //   document.body.appendChild(iframe)

// //   await new Promise<void>(res => iframe.onload = () => res())
// //   const conn = await transport.connect(iframe.contentWindow)

// //   conn.on('FRAME_TO_MAIN').subscribe(() => console.log('FRAME_TO_MAIN'))
// //   conn.listen()

// //   await conn.send('MAIN_TO_FRAME')
// // }

// // // Popup window
// // void async function() {
// //   const popupWindow = window.open('http://b.localhost:8080/frame?popup=true', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')

// //   console.log(popupWindow)
// //   popupWindow!.onload = () => console.log('hihi')
// //   await new Promise<void>(res => popupWindow!.onload = () => res())
  
// //   // const conn = await transport.connect(popupWindow)

// //   // conn.on('POPUP_TO_MAIN').subscribe(() => console.log('POPUP_TO_MAIN'))
// //   // conn.listen()

// //   // await conn.send('MAIN_TO_POPUP')
// // }

// // // IFrame connecting to parent
// // void async function() {
// //   const iframe = document.createElement('iframe')
// //   iframe.src = 'http://b.localhost:8080/frame?xframe=true'
// //   document.body.appendChild(iframe)
  
// //   // await new Promise<void>(res => iframe.onload = () => res())
// //   transport.connection.subscribe(async conn => {
// //     conn.on('XFRAME_TO_MAIN').subscribe(() => console.log('XFRAME_TO_MAIN'))
// //     conn.listen()

// //     await conn.send('MAIN_TO_XFRAME')
// //   })

// //   // const conn = await transport.connect(iframe.contentWindow)

// //   // conn.on('XFRAME_TO_MAIN').subscribe(() => console.log('XFRAME_TO_MAIN'))
// //   // conn.listen()

// //   // await conn.send('MAIN_TO_XFRAME')
// // }()