import { add_listeners } from './control/events';
const { app, BrowserWindow } = require('electron')



const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    })
    
    win.loadFile('dist/index.html');
    //add_listeners();
}

app.whenReady().then(() => {
    createWindow();
    
})
