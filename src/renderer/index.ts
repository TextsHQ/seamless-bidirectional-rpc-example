import './ipc'
import mainFnsBridge from './main-fns-bridge'

mainFnsBridge.getProcessType()
  .then(x => console.log(process.type, 'calling getProcessType() in main/browser process, result:', x))
