export const SUPPORT_SCRIPTS = /* javascript */`
  var ENVIRONMENT_IS_WEB = typeof window === 'object';
  var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  const _sleep = (d) => new Promise(setTimeout, d)

  class _Subject {
    constructor() {
      this._subscribers = {}
    }

    subscribe(cb) {
      const key = (Math.random() * 1000000000000000).toFixed().toString()
      this._subscribers[key] = cb
      return {
        unsubscribe: () => delete this._subscribers[key]
      }
    }

    next(value) {
      for (const key of Object.keys(this._subscribers)) {
        this._subscribers[key](value)
      }
    }
  }

  class _Observable {
    constructor(setupFn) {
      this._setupFn = setupFn
      this._subscribers = {}
    }

    static fromEvent(type, target) {
      return new _Observable(o => {
        const cb = v => o.next(v)
        target.addEventListener(type, cb)
        return () => target.removeEventListener(type, cb)
      })
    }

    subscribe(cb) {
      this._setup()
      const key = (Math.random() * 1000000000000000).toFixed().toString()
      this._subscribers[key] = cb
      return {
        unsubscribe: () => {
          delete this._subscribers[key]
          if (this._hasNoSubscribers() && typeof this.teardownFn !== 'undefined') {
            this.teardownFn()
          }
        }
      }
    }

    next(value) {
      for (const key of Object.keys(this._subscribers)) {
        this._subscribers[key](value)
      }
    }

    _hasNoSubscribers() {
      return Object.keys(this._subscribers).length === 0
    }

    _setup() {
      if (this._hasNoSubscribers() === false) {
        return
      }
      this.teardownFn = this._setupFn({
        next: v => this.next(v)
      })
    }
  }
`