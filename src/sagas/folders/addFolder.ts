import { put, call } from 'redux-saga/effects';

import { createFolder, fetchFolders } from 'actions/folders';
import { SagaArg } from 'types/saga';
import { insertFolder } from 'data/folders';

function* addFolderSaga (arg: SagaArg<string>) {
  try {
    const newFolder = {
      name: arg.payload,
      notes: [],
    };
    yield call(insertFolder, newFolder);
    yield put(fetchFolders());
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: createFolder.getType(),
  saga: addFolderSaga,
}
