export type Assign<T, U> = Pick<T, keyof Omit<T & U, keyof U>> & U;
