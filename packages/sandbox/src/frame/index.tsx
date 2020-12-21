// import { Transport } from '../lib'

// const transport = new Transport()

// // transport.connect(window.parent).then(conn => {
// //   conn.on('MAIN_TO_XFRAME').subscribe(() => console.warn('MAIN_TO_XFRAME'))
// //   conn.send('XFRAME_TO_MAIN')
// // })

// transport.connection.subscribe(conn => {
//   if (window.location.search.includes('xframe=true')) {
//     conn.on('MAIN_TO_XFRAME').subscribe(() => console.warn('MAIN_TO_XFRAME'))
//     conn.send('XFRAME_TO_MAIN')
//   } else if (window.location.search.includes('popup=true')) {
//     console.log('hi')
//     conn.on('MAIN_TO_POPUP').subscribe(() => console.warn('MAIN_TO_POPUP'))
//     conn.send('POPUP_TO_MAIN')
//   } else {
//     conn.on('MAIN_TO_FRAME').subscribe(() => console.warn('MAIN_TO_FRAME'))
//     conn.send('FRAME_TO_MAIN')
//   }
// })
