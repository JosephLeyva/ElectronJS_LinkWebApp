const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => {
    // Create a new BrowserWindow
    // This is the main process
    // that runs the app.
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true, // Enable node integration
            contextIsolation: false, // Enable context isolation

        }
    })
    // Load the index.html of the app.
    mainWindow.loadFile(__dirname + '/index.html')
});