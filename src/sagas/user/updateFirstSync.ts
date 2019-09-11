import { call } from 'redux-saga/effects';
import { updateUserFirstSync } from 'data/user';

// actions
import { setIsFirstSync } from 'actions/user';

// types
import { SagaArg } from 'types/saga';

function* updateFirstSyncSaga(arg: SagaArg<boolean>) {
  try {
    const { payload } = arg;
    yield call(updateUserFirstSync, payload);
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: setIsFirstSync.getType(),
  saga: updateFirstSyncSaga,
};
