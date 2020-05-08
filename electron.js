const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    opacity: 0.98,
    width: 1050,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    // maxWidth: 1800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('electron.html')
}

const isDev = process.env.DEV_MODE ? (process.env.DEV_MODE.trim() == "true") : false;

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
      });
}


app.whenReady().then(createWindow)
