const {app, BrowserWindow} = require('electron')
const electron = require('electron');
let consoleWindow, forWindow
global.sharedObject = {prop1: process.argv}

function createWindow () {
  var displays = electron.screen.getAllDisplays();
  for (var i in displays) {
    if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
      forWindow = new BrowserWindow({ x: displays[i].bounds.x, y: displays[i].bounds.y,width: displays[i].bounds.width,  height: displays[i].bounds.height, frame: false, webPreferences: { nodeIntegration: true, webSecurity: true } });
      forWindow.maximize();
      forWindow.loadURL('file://' + __dirname + '/for.html');
      //forWindow.openDevTools();
    }
    if (displays[i].bounds.x == 0 && displays[i].bounds.y == 0) {
      consoleWindow = new BrowserWindow({ x: displays[i].bounds.x, y: displays[i].bounds.y,width: displays[i].bounds.width,  height: displays[i].bounds.height, frame: true, webPreferences: { nodeIntegration: true } })
      consoleWindow.maximize();
      consoleWindow.loadURL('file://' + __dirname + '/index.html');
      consoleWindow.openDevTools();
    }
  }

  consoleWindow.on('closed', function () { consoleWindow = null, forWindow = null })
  forWindow.on('closed', function () { forWindow = null, consoleWindow = null })
}



app.on('ready', createWindow)

const{ipcMain}= require('electron')
ipcMain.on('close',(evt, arg)=>{
 app.quit()
})
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (consoleWindow === null) {
    createWindow()
  }
})