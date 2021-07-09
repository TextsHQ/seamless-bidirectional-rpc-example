// this executes in the renderer process
const exposedRendererFns = {
  getProcessType: () => process.type,
  cloneHumans: (arg: number) => arg * 42,
  becomeSentient: (arg: number) => 69 / arg,
}

export default exposedRendererFns
