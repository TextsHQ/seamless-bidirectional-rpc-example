// this executes in the main process
const exposedMainFns = {
  getProcessType: () => process.type,
  breakTheSimulation: (arg: number, cb: Function) => { cb(arg + 42) },
  findMeaningOfLife: (arg: number, cb: Function) => { cb(69 - arg) },
  setTimeout: (cb: Function, timeout: number) => { setTimeout(cb, timeout) },
}

export default exposedMainFns
