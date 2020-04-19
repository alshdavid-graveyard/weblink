declare const importScripts: any

export var ENVIRONMENT_IS_WEB = typeof window === 'object';
export var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';