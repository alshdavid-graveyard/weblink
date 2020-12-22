import { ENVIRONMENT_IS_WORKER } from "./get-self"
import { PREFIX, TransportAction, TransportEvent } from "./transport-actions"

export const CUSTOM_EVENT_NAME = '[weblink-debug]'

export const raiseDebug = (_window: Window, payload: any) => {
  const event: TransportEvent = {
    prefix: PREFIX,
    action: TransportAction.Debug,
    payload,
  }
  _window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: event }))
}