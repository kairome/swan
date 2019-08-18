import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';
import ElectronStore from 'electron-store';
import crypto from 'crypto-js';
import { changeDbFilesEncryption, clearDbFilesData } from './dbUtils';

interface ChangeHashPayload {
  oldHash: string,
  newHash: string,
}

let window: BrowserWindow | null;

const appData = app.getPath('appData');
const appName = 'Swan';
const userDataPath = path.join(appData, appName);
app.setPath('userData', userDataPath);

const getUserId = () => {
  const cpus = os.cpus().map(c => c.model).join('');
  return `${cpus}-${os.hostname()}-${os.platform()}${os.arch()}`;
};

const store = new ElectronStore<any>({
  defaults: {
    window: {
      width: 800,
      height: 600,
    },
    isProtected: false,
  },
  encryptionKey: crypto.SHA256(getUserId()).toString(),
});

const createWindow = () => {
  const windowSize = store.get('window');
  window = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });
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

  window.on('resize', () => {
    if (window !== null) {
      const size = window.getSize();
      const sizeOptions = {
        width: size[0],
        height: size[1],
      };
      store.set('window', sizeOptions);
    }
  });
};

ipcMain.on('get-auth-status', (event: any) => {
  // eslint-disable-next-line
  event.returnValue = store.get('isProtected');
});

ipcMain.on('test-hash', (event: any, key: string) => {
  const hash = crypto.SHA512(key).toString();

  // eslint-disable-next-line
  event.returnValue = hash === store.get('testHash');
});

ipcMain.on('change-hash', (event: any, payload: ChangeHashPayload) => {
  // Set new test hash
  const testHash = crypto.SHA512(payload.newHash).toString();
  store.set('testHash', testHash);

  // Re-encrypt files
  changeDbFilesEncryption(userDataPath, { key: payload.oldHash, newKey: payload.newHash });

  // Relaunch db
  event.reply('hash-ready', payload.newHash);
  event.reply('load-app');
});

ipcMain.on('turn-encryption-off', (event: any, key: string) => {
  // Remove test hash, set isProtected
  store.delete('testHash');
  store.set('isProtected', false);

  // Remove encryption
  changeDbFilesEncryption(userDataPath, { key });

  // Relaunch db
  event.reply('hash-ready', '');
  event.reply('load-app');
});

ipcMain.on('turn-encryption-on', (event: any, key: string) => {
  // Set new test hash
  const testHash = crypto.SHA512(key).toString();
  store.set('testHash', testHash);
  store.set('isProtected', true);

  // Encrypt db
  changeDbFilesEncryption(userDataPath, { key, firstEncryption: true });

  // Relaunch db
  event.reply('hash-ready', key);
  event.reply('load-app');
});

ipcMain.on('save-hash', (event: any, arg: string) => {
  event.reply('hash-ready', arg);
  event.reply('load-app');
});

ipcMain.on('init', (event: any) => {
  event.reply('load-app');
});

ipcMain.on('clear-data', () => {
  store.delete('testHash');
  store.set('isProtected', false);
  clearDbFilesData(userDataPath);
  if (window !== null) {
    window.reload();
  }
});

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
