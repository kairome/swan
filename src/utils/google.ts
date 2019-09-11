import { google } from 'googleapis';
import { GoogleCredentials } from 'types/user';
import { store } from 'index';
import { updateAccessToken } from 'actions/user';

export const GOOGLE_DRIVE_URL = 'https://www.googleapis.com/drive/v3/files';
export const UPLOAD_GOOGLE_DRIVE_URL = 'https://www.googleapis.com/upload/drive/v3/files';

export const oauthClient = new google.auth.OAuth2(process.env.CLIENT_ID, undefined, process.env.REDIRECT_URI);

export const getGoogleOAuth = (googleCredentials: GoogleCredentials) => {
  oauthClient.setCredentials({ ...googleCredentials });
  oauthClient.removeAllListeners();
  oauthClient.on('tokens', (tokens: GoogleCredentials) => {
    const { access_token, expiry_date } = tokens;
    if (access_token && access_token !== googleCredentials.access_token) {
      store.dispatch(updateAccessToken({ access_token, expiry_date }));
    }
  });
  return oauthClient;
};
