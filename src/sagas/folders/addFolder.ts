import { put, call } from 'redux-saga/effects';

import { createFolder, fetchFolders } from 'actions/folders';
import { SagaArg } from 'types/saga';
import { insertFolder } from 'data/folders';
import { CreateFolderPayload } from 'types/folders';

function* addFolderSaga(arg: SagaArg<CreateFolderPayload>) {
  try {
    const { name, order } = arg.payload;
    const newFolder = {
      name,
      order,
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
};
