import { Subject, Subscription } from 'rxjs';

interface Listener {
  callback: any;
  subscription: Subscription;
}

export class EventListener {
  public onEvent = new Subject();
  private subs: Array<Listener> = [];

  public triggerRaw(event: any) {
    setTimeout(() => this.onEvent.next(event), 0);
  }

  public trigger(data: any) {
    setTimeout(() => this.onEvent.next({ data }), 0);
  }

  public addEventListener(_type: string, callback: any) {
    const sub: Listener = {
      callback,
      subscription: this.onEvent.subscribe((event) => setTimeout(() => callback(event), 0)),
    };
    this.subs.push(sub);
  }

  public removeEventListener(_type: string, callback: any) {
    for (const i in this.subs) {
      if (callback !== this.subs[i].callback) {
        continue;
      }
      this.subs[i].subscription.unsubscribe();
      this.subs.splice(parseInt(i, 10) , 1);
    }
  }
}
