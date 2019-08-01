import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const appData = app.getPath('appData');
  const appName = 'Swan';
  const userDataPath = path.join(appData, appName);
  app.setPath('userData', userDataPath);
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath);
  }
  window.setMenuBarVisibility(false);
  window.setAutoHideMenuBar(true);

  if (process.env.NODE_ENV === 'production') {
    window.loadFile(`${__dirname}/public/index.html`);
  } else {
    window.loadURL('http://localhost:4005');
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});
