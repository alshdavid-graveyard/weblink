export class Counter {
  public done = false;
  private ticks = 0;

  constructor(
    private total: number,
    private onDone: () => void,
  ) {}

  public tick() {
    this.ticks++;
    if (this.ticks === this.total) {
      this.done = true;
      this.onDone();
    }
  }
}
