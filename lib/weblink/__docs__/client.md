# Broker Client Usage

On your broker client, initialise the client, wait for a handshake from the broker
then proceed to send messages through.

```typescript
import { messageBroker } from '@rokt/kit';

void async function main() {
  // Initialise client and wait for handshake
  const client = new messageBroker.Client({
    broker: window.parent,
  });

  // Wait for broker to connect. 
  // Use the connection object allows 
  // for interaction with the broker.
  client.onConnection.subscribe(connection => {

    // Listen to events coming from broker
    connection.onMessage.subscribe(console.log);
  
    // Dispatch message to broker
    connection.send('Hello Broker');
  })
}();
```
