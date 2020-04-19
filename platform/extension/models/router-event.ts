export type RouterEvent = {
  routerId: string
  routerAlias: string
  isReply: boolean
  objectId: string
  eventName: string,
  id: string,
  body?: any
  headers: Record<string, string>,
  hasError: boolean,
}

export type RouterDetails = {
  id: string
  alias: string
}