import { call, put } from 'redux-saga/effects';
import { saveUserSyncData } from 'data/user';
import { oauthClient } from 'utils/google';

// actions
import { revokeGoogleCredentials, saveUserSync } from 'actions/user';

// types
import { SagaArg } from 'types/saga';

const revokeCredentialsRequest = async (token: string) => oauthClient.revokeToken(token);

function* revokeCredentialsSaga(arg: SagaArg<string>) {
  try {
    yield call(revokeCredentialsRequest, arg.payload);
    yield call(saveUserSyncData, null);
    yield put(saveUserSync(null));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: revokeGoogleCredentials.getType(),
  saga: revokeCredentialsSaga,
};
