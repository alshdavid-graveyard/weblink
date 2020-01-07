import { Bus } from './broker'
import { defaultBrokerID } from './interfaces'

export type FromWorkerOptions = {
  targetOrigin?: string
  ID?: number
}

export const fromWorker = ({ ID = defaultBrokerID }: FromWorkerOptions = {}) => new Bus({
  ID,
  targetOrigin: '*',
  eventSource: self,
  postMessage: self.postMessage.bind(self),
  channelConstructor: self.MessageChannel,
})

export const connectToWorker = (bus: Bus, worker: any) => {
  bus.connect({
    bus: worker,
    selfListener: worker,
  })
}
