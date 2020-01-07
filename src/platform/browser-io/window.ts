import { Bus } from './broker'
import { defaultBrokerID } from './interfaces'

export type FromWindowOptions = {
  targetOrigin?: string
  ID?: number
}

export const fromWindow = ({ targetOrigin = '*', ID = defaultBrokerID }: FromWindowOptions = {}) => new Bus({
  targetOrigin,
  ID,
  eventSource: window,
  postMessage: window.postMessage.bind(window),
  channelConstructor: window.MessageChannel,
})