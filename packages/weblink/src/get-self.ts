// @ts-ignore
const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
const ENVIRONMENT_IS_WEB = typeof window === 'object';

export const getSelf = (): Window => {
  if (ENVIRONMENT_IS_WORKER) {
    return self
  } else if (ENVIRONMENT_IS_WEB) {
    return window
  }
  throw new Error('No Global Self/Window Found')
}
