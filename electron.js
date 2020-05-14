const { app, ipcMain, Menu, BrowserWindow } = require('electron');
const moment = require('moment');
const path = require('path');

let configuration = { defaultDir: '/Users/ping/Google Drive/Notes' };
global['configuration'] = configuration;

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    title: "Mindless",
    titleBarStyle: 'hiddenInset',
    opacity: 0.98,
    width: 1050,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    scrollBounce: true,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
    }
  })
  
  // and load the index.html of the app.
  win.loadFile('electron.html')

  // // load configurations
  // const configuration = { deafultDir: '/Users/ping/Google Drive/Notes' }
  // win.webContents.send('config', configuration);

}

function setupMenu() {
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { label: 'Open directory', accelerator: 'CmdOrCtrl+O', click() { selectNoteDirectory() } },        
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        { label: 'New Note', accelerator: 'CmdOrCtrl+N', click() { newFile() } },
        { type: 'separator' },
        { label: 'Search', accelerator: 'CmdOrCtrl+L', },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'zoom' }]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Github Markdown Syntax',
          click() {
            require('electron').shell.openExternal('https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax');
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

console.log(">>>", process.env.DEV_MODE);

const isDev = process.env.DEV_MODE ? (process.env.DEV_MODE.trim() == "true") : false;

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

ipcMain.handle('configuration', async (event, arg) => {
  // const configuration = { defaultDir: '/Users/ping/Google Drive/Notes' }
  console.log("Handling > ", configuration);
  return configuration;
});

function selectNoteDirectory(arg) {
  console.trace(arg);
}

function newFile(arg) {
  const filename = moment().format('YYYYMMDDhhmm');

  console.log(">>>>> newfile", filename);

  const focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.webContents.send('new-file');

  // ipcRenderer.invoke('new-file', (event, arg) => {
  //   console.log("sent new file event");
  // });
}

app.whenReady().then(createWindow).then(setupMenu);
