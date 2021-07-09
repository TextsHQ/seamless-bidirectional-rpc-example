import { ipcMain, BrowserWindow } from 'electron'
import type rendererFnsType from '../renderer/exposed-fns'
import type { Promisified } from '../types'

type ExportedFunctionsType = typeof rendererFnsType

export default function getRendererFnsBridge(window: BrowserWindow) {
  const requestQueue = new Map<number, { resolve: Function, reject: Function }>()

  ipcMain.on('EXPOSED_RENDERER_FN_RESULT', (_, { reqID, result, error }) => {
    const promise = requestQueue.get(reqID)
    if (error) promise?.reject(new Error(error.message))
    else promise?.resolve(result)
    requestQueue.delete(reqID)
  })

  let reqID = 0
  const rendererFns = new Proxy({}, {
    get: (target, key) =>
      (...args: any[]) =>
        new Promise((resolve, reject) => {
          requestQueue.set(++reqID, { resolve, reject })
          window.webContents.send('CALL_EXPOSED_RENDERER_FN', {
            reqID,
            methodName: key,
            args,
          })
        }),
  })
  return rendererFns as Promisified<ExportedFunctionsType>
}
