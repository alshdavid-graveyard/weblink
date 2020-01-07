import { EventSender } from './interfaces';
import { StreamEvent } from './stream-event';

export class HandlerContext {
  constructor(
    private connection: EventSender<StreamEvent>,
    private event: StreamEvent,
  ) { }

  public getBody() {
    return this.event.payload;
  }

  public sendError(data?: any) {
    const response = new StreamEvent(
      this.event.ID,
      this.event.eventType,
      data,
      true,
    );
    this.connection.send(response);
  }

  public send(data?: any) {
    const response = new StreamEvent(
      this.event.ID,
      this.event.eventType,
      data,
    );
    this.connection.send(response);
  }
}
