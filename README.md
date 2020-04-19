# Weblink

#### Connecting your Iframes, Web Workers and Pop-Up Windows

## Installation

```bash
npm install @alshdavid/weblink

# Or for Yarn users
yarn add @alshdavid/weblink
```

## Import Cost and Security

Providing a minimal import size cost and ensuring project safety is a very high priority for this project. 

To achieve this weblink includes 0 external libraries

## Usage

Initialise a link in both the parent and the child. A child can be anything that uses `postMessage` to communicate.

Compatible entities:
  - IFrame Elements
  - Web Workers
  - Service Workers
  - Pop-Up Windows
  - Chrome Extensions
  - Firefox Extensions
  - Node Workers (experimental)
  - Web Sockets (experimental)

#### Parent

```typescript
const link = weblink.create()

link.onConnection(conn => {
  conn.onMessage(console.log) // "Polo!"
  conn.send('Marco!')
})

const target = document.querySelector('#my-iframe')
link.connect(target.contentWindow)
```

#### Child 
```typescript
const link = weblink.create()

link.onConnection(conn => {
  conn.onMessage(console.log) // "Marco!"
  conn.send('Polo!')
})
```

#### Connectable

To connect to an entity it must match the `Connectable` interface. This describes an object with a form of the `postMessage` method.

```typescript
link.connect(target: Connectable)

interface Connectable {
  postMessage(msg: any, transferable: any[])
  postMessage(msg: any, origin: string, transferable: any[])
}
```

#### Router

Import the weblink router to add a promise based request / response system

```typescript
import { weblink } from 'weblink'
import { linkrouter } from 'weblink/router'

const link = weblink.create()

link.onConnection(conn => {
  const app = linkrouter.create(conn)

  app.use((req, res) => res.setHeader('marco', 'polo'))

  app.on('/my-path', (req, res) => {
    res.send('Got it')
  })
})
```

## Chrome Extension

Coming soon