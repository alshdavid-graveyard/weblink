export type Callback<T extends Array<any> = [], U = void> = (...args: T) => U

export interface IConnection {
  on<T = unknown>(action: string, callback: Callback<[T]>): Callback
  send<T = any>(action: string, payload?: T): Promise<void>
}

export class Connection implements IConnection {
  private readonly _listeners: Record<string, any[]> = {}
  private readonly _buffer: Record<string, unknown[]> = {}

  constructor(
    private readonly _port: MessagePort
  ) {
    _port.addEventListener('message', event => {
      const action = event.data.action
      if (!this._listeners[action]) {
        if (!this._buffer[action]) this._buffer[action] = []
        this._buffer[action].push(event.data.payload)
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
  }
}