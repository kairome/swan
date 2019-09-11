import { call } from 'redux-saga/effects';
import { updateUserSyncFrequency } from 'data/user';

// actions
import { updateSyncFrequency } from 'actions/user';

// types
import { SagaArg } from 'types/saga';

function* updateSyncFrequencySaga(arg: SagaArg<number>) {
  try {
    const { payload } = arg;
    yield call(updateUserSyncFrequency, payload);
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateSyncFrequency.getType(),
  saga: updateSyncFrequencySaga,
};
