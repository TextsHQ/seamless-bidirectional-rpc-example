import { ipcRenderer } from 'electron'
import type mainFnsType from '../main/exposed-fns'
import type { Promisified } from '../types'

type ExportedFunctionsType = typeof mainFnsType

const callbackRegistry = new Map<number, Function>()
let nextID = 0
function mapArg<T>(arg: T) {
  switch (typeof arg) {
    case 'function':
      callbackRegistry.set(++nextID, arg)
      return { type: 'function', cbID: nextID, includeArgs: arg.length > 0 }

    case 'object': {
      if (Array.isArray(arg)) return { type: 'array', data: arg.map(mapArg) }
      if (arg === null) return { type: 'object', data: null }
      const newObj = {}
      for (const [key, value] of Object.entries(arg)) {
        newObj[key] = mapArg(value)
      }
      return { type: 'object', data: newObj }
    }
  }
  return { type: 'etc', data: arg }
}

const mainFns = new Proxy({}, {
  get: (target, key) =>
    (...args: any[]) =>
      ipcRenderer.invoke('CALL_EXPOSED_MAIN_FN', { methodName: key, args: args.map(mapArg) }),
}) as Promisified<ExportedFunctionsType>

ipcRenderer.on('FN_CALLBACK', (_, { cbID, args = [] }) => {
  callbackRegistry.get(cbID)(...args)
})
ipcRenderer.on('FN_RELEASE_CALLBACK', (_, { cbID, args = [] }) => {
  const fn = callbackRegistry.get(cbID)
  callbackRegistry.delete(cbID)
})

export default mainFns
