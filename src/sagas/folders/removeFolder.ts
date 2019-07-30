import { call, put } from 'redux-saga/effects';
import { removeFolderById } from 'data/folders';

import { fetchFolders, removeFolder } from 'actions/folders';

// types
import { SagaArg } from 'types/saga';

function* removeFolderSaga(arg: SagaArg<string>) {
  try {
    yield call(removeFolderById, arg.payload);
    yield put(fetchFolders());
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: removeFolder.getType(),
  saga: removeFolderSaga,
};
