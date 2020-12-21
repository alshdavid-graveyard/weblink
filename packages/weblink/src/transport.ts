import { Callback, Connection, IConnection } from "./connection";
import { getSelf } from "./get-self";
import { targetIsWorker } from "./is-worker";

export interface ITransport {
  onConnection(callback: Callback<[IConnection], any>): Callback
  connect(target: any): Promise<IConnection>
}

export class Transport implements ITransport {
  private readonly _callbacks: Map<any, Callback<[Connection], any>> = new Map()
  private readonly _connections: Map<string, Callback<[Connection]>> = new Map()

  constructor(
    readonly _domains: string[] = [],
    readonly _window: Window = getSelf(),
  ) {
    const onMessage = (event: MessageEvent) => {
      if (!event.source && event.ports.length === 2) {
        // @ts-ignore
        _window.postMessage(event.data, [event.ports[1]])
      } else if (event.origin && _domains.length && !_domains.includes(event.origin)) {
        return
      } else if (event.source && event.ports.length === 2) {
        // @ts-ignore
        event.source.postMessage(event.data, event.origin, [event.ports[1]])
      }
      const connection = new Connection(event.ports[0])
      const callback = this._connections.get(event.data)
      if (callback) {
        callback(connection)
      }
      for (const callback of this._callbacks.values()) callback(connection)
    }

    _window.addEventListener('message', onMessage)
  }

  public onConnection(callback: Callback<[IConnection], any>): Callback {
    const key = {}
    this._callbacks.set(key, callback)
    return () => this._callbacks.delete(key)
  }

  public async connect(target: any): Promise<IConnection> {
    const identifier = (Math.random() * 1000000000000).toFixed(0)
    const { port1, port2 } = new MessageChannel()

    let isWorker = targetIsWorker(target)
  
    return new Promise<Connection>(res => {
      if (isWorker) {
        const onMessage = (event: MessageEvent) => {
          if (event.data === identifier) {
            target.removeEventListener('message', onMessage)
            const connection = new Connection(event.ports[0])
            for (const callback of this._callbacks.values()) callback(connection)
            res(connection)
          }
        }
        target.addEventListener('message', onMessage)
        target.postMessage(identifier, [port1, port2])
      } else {
        this._connections.set(identifier, conn => {
          this._connections.delete(identifier)
          res(conn)
        })
        target.postMessage(identifier, '*', [port1, port2])
      }
    })
  }
}

