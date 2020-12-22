import { raiseDebug } from "./debug"

export type Callback<T extends Array<any> = [], U = void> = (...args: T) => U

export type ConnectionEvent = {
  action: string
  payload: any
}

export type ConnectionInfo = {
  type: 'window' | 'worker'
  identifier: string
  port: 0 | 1
  alias: string
}

export interface IConnection {
  on<T = unknown>(action: string, callback: Callback<[T]>): Callback
  send<T = any>(action: string, payload?: T): Promise<void>
  info(): ConnectionInfo
}

export class Connection implements IConnection {
  private readonly _listeners: Record<string, any[]> = {}
  private readonly _buffer: Record<string, unknown[]> = {}

  constructor(
    private readonly _port: MessagePort,
    private readonly _info: ConnectionInfo,
    private readonly _window: Window,
  ) {
    _port.addEventListener('message', ({ data }) => {
      const { action, payload }: ConnectionEvent = data
      if (!this._listeners[action]) {
        if (!this._buffer[action]) this._buffer[action] = []
        this._buffer[action].push(payload)
      }
    })
    _port.start()
  }

  on<T = unknown>(action: string, callback: Callback<[T]>): Callback {
    if (!this._listeners[action]) this._listeners[action] = []
    this._listeners[action].push(callback)

    if (this._buffer[action]) for (const buffered of this._buffer[action]) {
      callback(buffered as T)
    }

    this._buffer[action] = []

    const onMessage = (event: MessageEvent) => {
      if(event.data.action === action) {
        callback(event.data.payload)
      }
    }
    this._port.addEventListener('message', onMessage)

    return () => {
      this._port.removeEventListener('message', onMessage)
      this._listeners[action] = this._listeners[action].filter((i: any) => i !== callback)
    }
  }

  async send<T = any>(action: string, payload?: T): Promise<void> {
    this._port.postMessage({ action, payload })
    raiseDebug(this._window, {
      info: this._info, 
      action,
      payload,
    })
  }

  info(): ConnectionInfo {
    return this._info
  }
}