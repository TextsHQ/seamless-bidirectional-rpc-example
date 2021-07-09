// this executes in the main process
const exposedMainFns = {
  getProcessType: () => process.type,
  breakTheSimulation: (arg: number) => arg + 42,
  findMeaningOfLife: (arg: number) => 69 - arg,
}

export default exposedMainFns
