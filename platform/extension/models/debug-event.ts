export const WEBLINK_DEBUG = 'WEBLINK_DEBUG'
export const WEBLINK_DEBUG_READY = 'WEBLINK_DEBUG_READY'

export enum DebugEventType {
  PAGE_REFRESH = 'PAGE_REFRESH',
  WEBLINK_EVENT = 'WEBLINK_EVENT',
}

export type DebugEvent = {
  type: DebugEventType,
  data: any
}
