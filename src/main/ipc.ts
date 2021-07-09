import { ipcMain } from 'electron'
import mainFns from './exposed-fns'

ipcMain.handle('CALL_EXPOSED_MAIN_FN', (event, { methodName, args }) =>
  mainFns[methodName](...args)
