export class Page {
  public script(cb: () => void) {
    return new Promise(res => {
      setTimeout(async () => {
        await Promise.resolve(cb());
        res();
      }, 0);
    });
  }
}
