import { ipcRenderer } from 'electron'
import rendererFns from './exposed-fns'

ipcRenderer.on('CALL_EXPOSED_RENDERER_FN', async (_, { reqID, methodName, args }) => {
  try {
    const result = await rendererFns[methodName](...args)
    ipcRenderer.send('EXPOSED_RENDERER_FN_RESULT', { reqID, result })
  } catch (err) {
    ipcRenderer.send('EXPOSED_RENDERER_FN_RESULT', { reqID, error: { message: err.message } })
  }
})
