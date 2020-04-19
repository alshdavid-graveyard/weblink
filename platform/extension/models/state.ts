import { WeblinkEvent } from './weblink-event'

export class State {
  inspectedWindowId: number = 0
  weblink = new WeblinkState()
}

export class WeblinkState {
  events: WeblinkEvent[] = []
}