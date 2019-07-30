import { put, call } from 'redux-saga/effects';

import { getAllFolders } from 'data/folders';
import { fetchFolders, saveAllFolders } from 'actions/folders';

function* getAllFoldersSaga() {
  try {
    const folders = yield call(getAllFolders);
    yield put(saveAllFolders(folders));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchFolders.getType(),
  saga: getAllFoldersSaga,
};
