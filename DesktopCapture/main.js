const { app, BrowserWindow } = require('electron');
const electron = require('electron');
let mainWindow;


app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', () => {
  var displays = electron.screen.getAllDisplays();
  var externalDisplay = null;
  for (var i in displays) {
    if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
      externalDisplay = displays[i];
      break;
    }
  }
  if (externalDisplay) {
    mainWindow = new BrowserWindow({ x: externalDisplay.bounds.x, y: externalDisplay.bounds.y, frame: false, webPreferences: { nodeIntegration: true } });
  }
  mainWindow.maximize();
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
