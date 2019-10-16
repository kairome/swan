import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
} from 'electron';
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

const createStorage = () => {
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath);
  }

  const nedbPath = path.join(userDataPath, 'nedb');
  if (!fs.existsSync(nedbPath)) {
    fs.mkdirSync(nedbPath);
  }
};

const store = new ElectronStore<any>({
  defaults: {
    window: {
      width: 850,
      height: 700,
    },
    theme: 'light',
    accentColor: '#00138c',
  },
});

createStorage();
const hashStore = createHashStore(userDataPath);

const getMenuTemplate = (): MenuItemConstructorOptions[] => {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' },
        ] : [
          { role: 'close' },
        ]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            // const { shell } = require('electron')
            // await shell.openExternal('https://electronjs.org')
          },
        },
      ],
    },
  ];

  return template as MenuItemConstructorOptions[];
};

const createWindow = () => {
  const windowSize = store.get('window');
  window = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    minWidth: 850,
    minHeight: 700,
    show: false,
    icon: `${__dirname}/icons/png/app.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate()));

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

ipcMain.on('change-theme', (event: any, theme: 'light' | 'dark') => {
  store.set('theme', theme);
  event.reply('update-theme');
});

ipcMain.on('get-theme', (event: any) => {
  // eslint-disable-next-line
  event.returnValue = store.get('theme');
});

ipcMain.on('change-accent-color', (event: any, color: string) => {
  store.set('accentColor', color);
  event.reply('update-accent-color');
});

ipcMain.on('get-accent-color', (event: any) => {
  // eslint-disable-next-line
  event.returnValue = store.get('accentColor');
});

const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (window) {
      if (window.isMinimized()) {
        window.restore();
      }

      window.focus();
    }
  });
  app.on('ready', createWindow);
}

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
