import { Callback, Connection, ConnectionInfo, IConnection } from "./connection";
import { CUSTOM_EVENT_NAME } from "./debug";
import { ENVIRONMENT_IS_WORKER, getSelf } from "./get-self";
import { targetIsWorker } from "./is-worker";
import { Subject } from "./subject";
import { PREFIX, TransportAction, TransportEvent } from "./transport-actions";

export interface ITransport {
  onConnection(callback: Callback<[IConnection], any>): Callback
  connect(target: any): Promise<IConnection>
}

export class Transport implements ITransport {
  private readonly _onConnection = new Subject<Connection>()
  private readonly _connections: Map<string, Callback<[Connection]>> = new Map()

  constructor(
    readonly _domains: string[] = [],
    readonly _window: Window = getSelf(),
  ) {
    _window.addEventListener(CUSTOM_EVENT_NAME, (event: any) => {
      if (ENVIRONMENT_IS_WORKER) {
        // @ts-ignore
        _window.postMessage(event.detail)
      } else if (_window.parent !== _window) {
        _window.postMessage(event.detail, '*')
      } else {
        console.log('parent', event.data.payload)
      }
    })

    const onMessage = (event: MessageEvent) => {
      const { prefix, action, payload }: TransportEvent = event.data
      if (prefix !== PREFIX) return
      if (action === TransportAction.Debug) {
        console.log('parent', event.data.payload)
        return
      }

      if (action !== TransportAction.Initial) return

      let connection: Connection | undefined
      const connectionDetails: ConnectionInfo = {
        type: 'worker',
        identifier: payload.identifier,
        port: 1,
        alias: payload.alias,
      }
      
      // Web Worker
      if (!event.source && event.ports.length === 2) {
        connection = new Connection(event.ports[0], connectionDetails, this._window)
        connectionDetails.type = 'window'
        // @ts-ignore
        _window.postMessage(event.data, [event.ports[1]])
      } 
      
      // Iframe
      if (event.source && event.ports.length === 2) {
        if (event.origin && _domains.length && !_domains.includes(event.origin)) return
        connection = new Connection(event.ports[0], connectionDetails, this._window)
        // @ts-ignore
        event.source.postMessage(event.data, event.origin, [event.ports[1]])
      }

      // Return Route
      if (event.ports.length === 1) {
        const resolve = this._connections.get(payload.identifier)
        connectionDetails.port = 0
        if (!ENVIRONMENT_IS_WORKER) connectionDetails.type = 'window'
        connection = new Connection(event.ports[0], connectionDetails, this._window)
        if (resolve) resolve(connection)
      }

      if (connection) this._onConnection.next(connection)
    }

    _window.addEventListener('message', onMessage)
  }

  public onConnection(callback: Callback<[IConnection], any>): Callback {
    return this._onConnection.subscribe(callback)
  }

  public async connect(target: any, alias: string = ''): Promise<IConnection> {
    const identifier = (Math.random() * 1000000000000).toFixed(0)
    const { port1, port2 } = new MessageChannel()

    let isWorker = targetIsWorker(target)

    const payload: TransportEvent = { 
      prefix: PREFIX, 
      action: TransportAction.Initial,
      payload: { identifier, alias } 
    }
  
    return new Promise<Connection>(res => {
      if (isWorker) {
        const onMessage = (event: MessageEvent) => {
          const data: TransportEvent = event.data
          if (data.prefix !== PREFIX) return
          if (data.action === TransportAction.Debug) {
            target.postMessage(data)
          }
          if (data.action === TransportAction.Initial && data.payload.identifier === identifier) {
            // target.removeEventListener('message', onMessage)
            const details: ConnectionInfo = {
              type: 'worker',
              identifier,
              port: 0,
              alias,
            }
            const connection = new Connection(event.ports[0], details, this._window)
            this._onConnection.next(connection)
            res(connection)
          }
        }
        target.addEventListener('message', onMessage)
        target.postMessage(payload, [port1, port2])
      } else {
        this._connections.set(identifier, conn => {
          this._connections.delete(identifier)
          res(conn)
        })
        target.postMessage(payload, '*', [port1, port2])
      }
    })
  }
}

