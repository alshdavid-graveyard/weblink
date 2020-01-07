export const duration = (ms: number = 0) => new Promise(res => {
  const timeout = setTimeout(() => {
    res(timeout);
  }, ms);
});
