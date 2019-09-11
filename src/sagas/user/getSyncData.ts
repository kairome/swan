import { call, put } from '@redux-saga/core/effects';
import { getUserSyncData } from 'data/user';

// actions
import { fetchUserSyncData, saveUserSync } from 'actions/user';

// types
import { UserSyncData } from 'types/user';

function* getUserSyncDataSaga() {
  try {
    const syncData: UserSyncData | null = yield call(getUserSyncData);
    yield put(saveUserSync(syncData));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchUserSyncData.getType(),
  saga: getUserSyncDataSaga,
};
