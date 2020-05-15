const { app, dialog, ipcMain, Menu, BrowserWindow } = require('electron');
const moment = require('moment');
const path = require('path');
const fs = require('fs').promises;


let configuration = { defaultDir: '/Users/ping/Google Drive/Notes' };
global['configuration'] = configuration;

let lastFileName = undefined;
let currentFile = undefined;


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
        { label: 'New Note', accelerator: 'Cmd+N', click() { newFile() } },
        { label: 'Delete Note', accelerator: 'Cmd+Backspace', click() { deleteFile() }},
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

ipcMain.handle('select-file', (event, filename) => {
  console.log('selecting file>>', filename);
  currentFile = filename;
});

ipcMain.handle('saved-file', (event, filename) => {
  console.log('saved file>>', filename);
});

function selectNoteDirectory(arg) {
  console.trace(arg);
}

async function newFile(arg) {
  const filename = Number.parseInt(moment().format('YYYYMMDDhhmm'));

  if (!lastFileName) {
    lastFileName = filename;
  } else if ( lastFileName >= filename ) {
    lastFileName = lastFileName+1;
  } else {
    lastFileName = filename;
  }

  console.log(">>>>> newfile", lastFileName);

  await fs.writeFile(`${configuration.defaultDir}/${lastFileName}.md`, `# ${lastFileName}`);

  const focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.webContents.send('new-file', `${lastFileName}.md`);
}

function deleteFile() {
  console.warn("deleting file");
  const options  = {
    type: 'question',
    detail: `Click Yes to delete ${currentFile}`,
    buttons: ["Yes","No"],
    message: "Do you really want to delete this note?"
   }
  const response = dialog.showMessageBox(options);
  response.then(async result => {
    console.log(result);
    if (result.response == 0) {
      await fs.unlink(`${configuration.defaultDir}/${currentFile}`);
      const focusedWindow = BrowserWindow.getFocusedWindow();
      focusedWindow.webContents.send('delete-file', `${currentFile}`);
      console.log("confirm delete file"); 
    }
  }).catch( err => {
    console.warn("Failed to delete file: ", err);
  });
}


app.whenReady().then(createWindow).then(setupMenu);
