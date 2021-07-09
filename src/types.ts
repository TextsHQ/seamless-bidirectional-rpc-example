type AnyFunction = (...args: any[]) => any
type Async<F extends AnyFunction> = ReturnType<F> extends Promise<any>
  ? F
  : (...args: Parameters<F>) => Promise<ReturnType<F>>

export type Promisified<T> = { [K in keyof T]: T[K] extends AnyFunction ? Async<T[K]> : never }
