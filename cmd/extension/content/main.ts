import { DebugEvent, DebugEventType, WEBLINK_DEBUG, WEBLINK_DEBUG_READY } from '~/platform/extension'
import { SUPPORT_SCRIPTS } from './lib/support_scripts'
import { stdom } from '../../../platform/stdom'

console.log({
  worker: stdom.ENVIRONMENT_IS_WORKER
})

const sendMessage = (event: DebugEvent) => chrome.runtime.sendMessage(event)

if (performance.navigation.type == 1) {
  sendMessage({ type: DebugEventType.PAGE_REFRESH, data: null })
}

window.addEventListener('message', (event) => {
  if (event.data.to !== WEBLINK_DEBUG) {
    return
  }
  delete event.data.to
  sendMessage(event.data)
})

const s = document.createElement('script')
s.innerHTML = /*javascript*/`
(() => {
  ${SUPPORT_SCRIPTS}

  const postMessage$ = _Observable.fromEvent('message', window)

  function triggerWeblinkEvent(data) {
    window.postMessage({ 
      to: '${WEBLINK_DEBUG}',
      type: '${DebugEventType.WEBLINK_EVENT}', 
      data, 
    })
  }

  const obj = {
    postMessage$,
    triggerWeblinkEvent,
  }

  if (ENVIRONMENT_IS_WORKER) {
    self['${WEBLINK_DEBUG}'] = obj
  } else {
    window['${WEBLINK_DEBUG}'] = obj
  }

  window.postMessage({ from: '${WEBLINK_DEBUG}', type: '${WEBLINK_DEBUG_READY}' })
})()
`
document.head.appendChild(s)


