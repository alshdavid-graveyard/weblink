import { Subscription, Subject } from 'rxjs'
import { DebugEvent, State, DebugEventType, WeblinkEvent } from '~/platform/extension'

const $stateChange = new Subject<void>()
let state: State = new State()
let currentPanel: Window | undefined

chrome.devtools.panels.create("Weblink", null, "/panel/index.html", page => {
  let sub: Subscription | undefined

  page.onShown.addListener(
    panel => {
      panel = panel
      state.inspectedWindowId = chrome.devtools.inspectedWindow.tabId
      panel.postMessage(state, '*')
      sub = $stateChange.subscribe(() => panel.postMessage(state, '*'))
    }
  )

  page.onHidden.addListener(() => {
    if (sub) {
      sub.unsubscribe()
    }
  })
});

// Event Handlers
chrome.runtime.onMessage.addListener((event: DebugEvent, sender) => {
  if (sender.tab?.id !== chrome.devtools.inspectedWindow.tabId) {
    return
  }

  if (event.type === DebugEventType.PAGE_REFRESH) {
    if (currentPanel) {
      currentPanel.location.reload()
    }
    state = new State()
  }

  if (event.type === DebugEventType.WEBLINK_EVENT) {
    const data: WeblinkEvent = event.data
    state.weblink.events.push(data)
  }
  $stateChange.next()
})
