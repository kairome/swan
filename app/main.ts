import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import ElectronStore from 'electron-store';
import crypto from 'crypto-js';
import _ from 'lodash';
import { changeDbFilesEncryption, clearDbFilesData, getDbFiles } from './dbUtils';
import googleAuth from './googleAuth';
import createHashStore from './hashStore';

interface ChangeHashPayload {
  oldHash: string,
  newHash: string,
}

let window: BrowserWindow | null;

const appData = app.getPath('appData');
const appName = 'Swan';
const userDataPath = path.join(appData, appName);
app.setPath('userData', userDataPath);

const store = new ElectronStore<any>({
  defaults: {
    window: {
      width: 800,
      height: 600,
    },
  },
});

const hashStore = createHashStore(userDataPath);

const createWindow = () => {
  const windowSize = store.get('window');
  window = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    show: false,
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

  window.once('ready-to-show', () => {
    if (window !== null) {
      window.show();
    }
  });

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
  event.returnValue = hashStore.isProtected();
});

ipcMain.on('test-hash', (event: any, key: string) => {
  const hash = crypto.SHA512(key).toString();
  // eslint-disable-next-line
  event.returnValue = hash === hashStore.getHash();
});

ipcMain.on('change-hash', (event: any, payload: ChangeHashPayload) => {
  // Set new test hash
  const testHash = crypto.SHA512(payload.newHash).toString();
  hashStore.setHash(testHash);

  // Re-encrypt files
  changeDbFilesEncryption(userDataPath, { key: payload.oldHash, newKey: payload.newHash });

  // Relaunch db
  event.reply('hash-ready', payload.newHash);
  event.reply('load-app');
  event.reply('hash-changed');
});

ipcMain.on('turn-encryption-off', (event: any, key: string) => {
  // Remove test hash
  hashStore.setHash('');

  // Remove encryption
  changeDbFilesEncryption(userDataPath, { key });

  // Relaunch db
  event.reply('hash-ready', '');
  event.reply('load-app');
});

ipcMain.on('turn-encryption-on', (event: any, key: string) => {
  // Set new test hash
  const testHash = crypto.SHA512(key).toString();
  hashStore.setHash(testHash);

  // Encrypt db
  changeDbFilesEncryption(userDataPath, { key, firstEncryption: true });

  // Relaunch db
  event.reply('hash-ready', key);
  event.reply('load-app');
});

ipcMain.on('save-hash', (event: any, key: string) => {
  event.reply('hash-ready', key);
  event.reply('load-app');
});

ipcMain.on('init', (event: any) => {
  event.reply('load-app');
});

ipcMain.on('clear-data', () => {
  hashStore.setHash('');
  clearDbFilesData(userDataPath);
  if (window !== null) {
    window.reload();
  }
});

ipcMain.on('google-sign-in', (event: any) => {
  googleAuth(window)
    .then((code: string) => {
      event.reply('google-sign-in-code', code);
    })
    .catch(() => {
      event.reply('google-sign-in-failed');
    });
});

ipcMain.on('get-app-files', (event: any) => {
  // eslint-disable-next-line
  event.returnValue = {
    ...getDbFiles(userDataPath),
  };
});

ipcMain.on('restore-from-google', (event: any, files: { [k: string]: string, }) => {
  const dbFilesPath = path.join(userDataPath, 'nedb');
  _.forEach(_.keys(files), (fileName) => {
    const filePath = path.join(dbFilesPath, fileName);
    fs.writeFileSync(filePath, files[fileName], 'utf8');
  });

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
