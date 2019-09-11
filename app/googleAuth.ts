import { BrowserWindow } from 'electron';
import queryString from 'query-string';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const handleCodeRedirect = async (url: string) => {
  const queries = url.split(':/auth-code')[1];
  if (queries) {
    const parsed = queryString.parse(queries);
    if (parsed.code) {
      return String(parsed.code);
    }

    const errorMsg = parsed.error ? String(parsed.error) : 'Something went wrong. Sign in failed.';
    throw new Error(errorMsg);
  }

  throw new Error('Invalid redirect url.');
};

const initSignIn = (mainWindow: BrowserWindow | null) => new Promise((resolve, reject) => {
  const authWindow = new BrowserWindow({
    width: 580,
    height: 640,
    show: false,
    parent: mainWindow !== null ? mainWindow : undefined,
    modal: true,
  });

  authWindow.setMenuBarVisibility(false);
  authWindow.setAutoHideMenuBar(true);

  authWindow.once('ready-to-show', () => {
    authWindow.show();
  });

  // TODO: code_challenge
  const urlParams = {
    response_type: 'code',
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/drive.appdata',
    hl: 'en',
  };

  const authUrl = `${GOOGLE_AUTH_URL}?${queryString.stringify(urlParams)}`;

  authWindow.webContents.on('will-navigate', (event, url) => {
    if (url.includes('/auth-code')) {
      handleCodeRedirect(url)
        .then((resp) => {
          resolve(resp);
          authWindow.close();
        })
        .catch((error) => {
          reject(error);
          authWindow.close();
        });
    }

    if (url === 'https://www.google.com/') {
      authWindow.close();
      reject(new Error('Took too long.'));
    }
  });

  authWindow.loadURL(authUrl);
});

export default initSignIn;
