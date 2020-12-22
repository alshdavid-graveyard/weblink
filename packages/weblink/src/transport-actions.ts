export const PREFIX = '[WEBLINK]'

export enum TransportAction {
  Initial,
  Debug,
}

export type TransportEvent = {
  prefix: typeof PREFIX
  action: TransportAction
  payload: any
}