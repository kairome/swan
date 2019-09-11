import { call, put } from 'redux-saga/effects';
import { saveUserSyncData } from 'data/user';
import { oauthClient } from 'utils/google';

// actions
import { fetchGoogleAuthToken, saveUserSync } from 'actions/user';

// types
import { SagaArg } from 'types/saga';
import { GoogleCredentials } from 'types/user';

const getTokenRequest = async (code: string) => {
  const { tokens } = await oauthClient.getToken(code);
  return tokens;
};

function* getGoogleTokenSaga(arg: SagaArg<string>) {
  try {
    const tokenPayload: GoogleCredentials = yield call(getTokenRequest, arg.payload);
    const syncData = {
      googleCredentials: tokenPayload,
      syncFrequency: 30,
      firstTime: true,
    };

    yield call(saveUserSyncData, syncData);
    yield put(saveUserSync(syncData));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchGoogleAuthToken.getType(),
  saga: getGoogleTokenSaga,
};
