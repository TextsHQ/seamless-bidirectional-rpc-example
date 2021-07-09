import { ipcMain, BrowserWindow } from 'electron'
import mainFns from './exposed-fns'

export default function registerIPC(window: BrowserWindow) {
  const cbFinalizationRegistry = new FinalizationRegistry((cbID: number) => {
    window.webContents.send('FN_RELEASE_CALLBACK', cbID)
  })

  function mapArg<T extends { type: 'function' | 'object' | 'array' | 'etc', cbID?: string, includeArgs?: boolean, data: any }>(arg: T) {
    switch (arg.type) {
      case 'function': {
        const fn = (...args) => {
          window.webContents.send('FN_CALLBACK', { cbID: arg.cbID, args: arg.includeArgs ? args : undefined })
        }
        cbFinalizationRegistry.register(fn, arg.cbID)
        return fn
      }

      case 'object': {
        if (arg.data === null) return null
        const newObj = {}
        for (const [key, value] of Object.entries(arg.data)) {
          newObj[key] = mapArg(value as any)
        }
        return newObj
      }

      case 'array': {
        return arg.data.map(mapArg)
      }

      case 'etc': {
        return arg.data
      }
    }
  }

  ipcMain.handle('CALL_EXPOSED_MAIN_FN', (_, { methodName, args }) =>
    mainFns[methodName](...args.map(mapArg)))
}
