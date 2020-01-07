import { InternalMessages } from './internal';
import { StreamEvent } from './stream-event';

export class PreflightEvent extends StreamEvent {
  constructor() {
    super(
      '',
      InternalMessages.Preflight,
      '',
    );
  }
}
