import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import registerIPC from './ipc'
import getRendererFnsBridge from './renderer-fns-bridge'

async function onWindowCreate(window: BrowserWindow) {
  const rendererFnsBridge = getRendererFnsBridge(window)
  const x = await rendererFnsBridge.getProcessType()
  console.log(process.type, 'calling getProcessType() in renderer process, result:', x)
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 800,
  })

  registerIPC(mainWindow)
  mainWindow.loadFile(path.join(__dirname, '../../index.html'))
  mainWindow.webContents.openDevTools()

  onWindowCreate(mainWindow)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
