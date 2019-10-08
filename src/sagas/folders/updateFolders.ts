import { put, call } from 'redux-saga/effects';

import { fetchFolders, updateFolders } from 'actions/folders';
import { SagaArg } from 'types/saga';
import { updateFolderItems } from 'data/folders';
import { FolderItem } from 'types/folders';

function* updateFolderSaga(arg: SagaArg<FolderItem[]>) {
  try {
    yield call(updateFolderItems, arg.payload);
    yield put(fetchFolders());
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateFolders.getType(),
  saga: updateFolderSaga,
};
