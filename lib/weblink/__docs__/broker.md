# Broker Usage

On your broker host, initialise the broker and use it to add/communicate with clients

```typescript
import { messageBroker } from '@rokt/kit';

void async function main() {
  // Create broker instance
  const broker = new messageBroker.Broker({
    targetOrigin: '*',
  });

  // Wait for a client to connect. 
  // Use the connection object allows 
  // for interaction with the client.
  broker.onConnection.subscribe(connection => {

    // Listen to events coming from iframe client
    connection.onMessage.subscribe(console.log);
  
    // Dispatch message to iframe
    connection.send('Hello iFrame');
  })
  
}();
```
