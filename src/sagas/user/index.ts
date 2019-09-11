import getGoogleToken from 'sagas/user/getGoogleToken';
import getSyncData from 'sagas/user/getSyncData';
import uploadToDrive from 'sagas/user/uploadToDrive';
import updateToken from 'sagas/user/updateToken';
import revokeCredentials from 'sagas/user/revokeCredentials';
import downloadDriveFile from 'sagas/user/downloadDriveFile';
import removeDriveFiles from 'sagas/user/removeDriveFiles';
import updateSyncFrequency from 'sagas/user/updateSyncFrequency';
import updateFirstSync from 'sagas/user/updateFirstSync';

export default [
  getGoogleToken,
  getSyncData,
  updateToken,
  uploadToDrive,
  revokeCredentials,
  downloadDriveFile,
  removeDriveFiles,
  updateSyncFrequency,
  updateFirstSync,
];
