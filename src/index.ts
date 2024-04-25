const { app, BrowserWindow } = require('electron')


const createWindow = () => {
    const window = new BrowserWindow({
      fullscreen: true
    })
    
    window.loadFile('dist/index.html');
    window.setFullScreen(1);
    //add_listeners();
}

app.whenReady().then(() => {
    createWindow();
})
