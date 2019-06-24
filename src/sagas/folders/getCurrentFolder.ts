import { put, call } from 'redux-saga/effects';

import { fetchCurrentFolder, saveCurrentFolder } from 'actions/folders';
import { SagaArg } from 'types/saga';
import { getFolderById } from 'data/folders';
import { fetchFolderNotes } from 'actions/notes';

function* getCurrentFolderSaga (arg: SagaArg<string>) {
  try {
    const currentFolder = yield call(getFolderById, arg.payload);
    if (currentFolder === null) {
      return;
    }

    yield put(saveCurrentFolder(currentFolder));
    yield put(fetchFolderNotes(currentFolder._id));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchCurrentFolder.getType(),
  saga: getCurrentFolderSaga,
}
