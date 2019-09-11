import { drive_v3, google } from 'googleapis';

const getAppFiles = async (oauthClient: any): Promise<drive_v3.Schema$FileList> => {
  const drive = google.drive({
    version: 'v3',
    auth: oauthClient,
    retryConfig: {
      retry: 1,
    },
  });
  const response = await drive.files.list({ spaces: 'appDataFolder' });
  return response.data;
};

export default getAppFiles;
