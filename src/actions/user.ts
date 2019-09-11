import { createReducer, createAction } from 'redux-act';
import { AccessTokenPayload, GoogleCredentials, UserSyncData } from 'types/user';

export const fetchUserSyncData = createAction('FETCH_USER_SYNC_DATA');

export const fetchGoogleAuthToken = createAction<string>('FETCH_GOOGLE_AUTH_TOKEN');
export const saveUserSync = createAction<UserSyncData | null>('SAVE_GOOGLE_TOKEN');
export const updateAccessToken = createAction<AccessTokenPayload>('UPDATE_GOOGLE_ACCESS_TOKEN');

export const uploadAppData = createAction<GoogleCredentials>('UPLOAD_APP_DATA');
export const downloadDriveFiles = createAction<GoogleCredentials>('DOWNLOAD_DRIVE_FILE');
export const removeDriveFiles = createAction<GoogleCredentials>('REMOVE_DRIVE_FILES');

export const revokeGoogleCredentials = createAction<string>('REVOKE_GOOGLE_CREDENTIALS');
export const setIsFirstSync = createAction<boolean>('SET_FIRST_SYNC');

export const updateSyncFrequency = createAction<number>('UPDATE_SYNC_FREQUENCY');

interface UserReducer {
  sync: UserSyncData | null,
}

const reducer = createReducer<UserReducer>({}, {
  sync: null,
});

reducer.on(saveUserSync, (state, sync): UserReducer => ({
  ...state,
  sync,
}));

reducer.on(updateAccessToken, (state, accessToken): UserReducer => {
  if (state.sync === null) {
    return state;
  }
  const newGoogleCredentials = {
    ...state.sync.googleCredentials,
    ...accessToken,
  };
  return {
    ...state,
    sync: {
      ...state.sync,
      googleCredentials: newGoogleCredentials,
    },
  };
});

reducer.on(setIsFirstSync, (state, firstTime) => {
  if (state.sync === null) {
    return state;
  }

  return {
    ...state,
    sync: {
      ...state.sync,
      firstTime,
    },
  };
});

reducer.on(updateSyncFrequency, (state, syncFrequency) => {
  if (state.sync === null) {
    return state;
  }

  return {
    ...state,
    sync: {
      ...state.sync,
      syncFrequency,
    },
  };
});

export default reducer;
