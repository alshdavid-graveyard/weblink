export type Callback<T extends Array<any> = [], U = void> = (...args: T) => U

export class Subject<T = any> {
  private readonly _callbacks: Map<any, Callback<[T], any>> = new Map()

  public subscribe(callback: Callback<[T], any>): Callback {
    const key = {}
    this._callbacks.set(key, callback)
    return () => this._callbacks.delete(key)
  }

  public next(value: T) {
    for (const callback of this._callbacks.values()) callback(value)
  }
}