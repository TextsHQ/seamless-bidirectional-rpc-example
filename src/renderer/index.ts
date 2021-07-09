import './ipc'
import mainFnsBridge from './main-fns-bridge'

mainFnsBridge.getProcessType()
  .then(x => console.log(process.type, 'calling getProcessType() in main/browser process, result:', x))

// call main functions seamlessly including functions
mainFnsBridge.setTimeout(() => {
  console.log('this callback was called by setTimeout executed in main process')
}, 1000)
