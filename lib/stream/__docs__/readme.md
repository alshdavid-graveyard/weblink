# Stream Package

This package is intended to apply a context-bound request/response model to duplex event streams.

Usage example:

### Server

```typescript
import { messageBroker, stream } from '@rokt/kit'

const broker = new messageBroker.Broker()

broker.onConnection.subscribe(connection => {
  const router = new stream.Router(connection)

  router.event('EVENT_NAME', ctx => {
    const body = ctx.getBody()
    if (body === 'marco') {
        ctx.send('polo')
    } else {
        ctx.sendError('InvalidMessage')
    }
  })
})
```

### Client

```typescript
import { messageBroker, stream } from '@rokt/kit'

const client = new messageBroker.Client()

client.onConnection.subscribe(async connection => {
  const streamClient = new stream.Client(connection)
  
  try {
    const response = await streamClient.send('EVENT_NAME', { body: 'marco' })
    console.log(response)
  } catch (err) {
    console.log(err)
  }
})
```

## Interfaces

```typescript
interface Context {
  getBody(): any
  sendError(payload?: any): any
  send(payload?: any)
}

interface Router {
  on(event: string, callback: (ctx: Context) => void): void
  destroy(): void
}

type ClientSendOptions = {
  body?: any
}

interface Client {
  send(event: string, options: ClientSendOptions): Promise<any>
}
```

Both the `Router` and the `Client` should accept the following interface

```typescript
interface EventSenderReceiver {
  onMessage: rxjs.Observable<any>
  send(data: any): void
}
```
