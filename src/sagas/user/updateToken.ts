import { call } from 'redux-saga/effects';
import { updateUserAccessToken } from 'data/user';

// actions
import { updateAccessToken } from 'actions/user';

// types
import { AccessTokenPayload } from 'types/user';
import { SagaArg } from 'types/saga';

function* updateTokenSaga(arg: SagaArg<AccessTokenPayload>) {
  try {
    const { payload } = arg;
    yield call(updateUserAccessToken, payload.access_token);
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateAccessToken.getType(),
  saga: updateTokenSaga,
};
