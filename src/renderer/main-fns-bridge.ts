import { ipcRenderer } from 'electron'
import type mainFnsType from '../main/exposed-fns'
import type { Promisified } from '../types'

type ExportedFunctionsType = typeof mainFnsType

const mainFns = new Proxy({}, {
  get: (target, key) =>
    (...args: any[]) =>
      ipcRenderer.invoke('CALL_EXPOSED_MAIN_FN', { methodName: key, args }),
}) as Promisified<ExportedFunctionsType>

export default mainFns
