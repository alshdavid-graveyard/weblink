export class StreamEvent {
  constructor(
    public ID: string,
    public eventType: string,
    public payload: any,
    public hasError: boolean = false,
  ) { }
}
