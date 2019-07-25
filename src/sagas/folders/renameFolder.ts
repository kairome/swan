import { put, call } from 'redux-saga/effects';

import { renameFolder, fetchFolders, fetchCurrentFolder } from 'actions/folders';
import { SagaArg } from 'types/saga';
import { updateFolderName } from 'data/folders';
import { RenameFolderPayload } from 'types/folders';

function* renameFolderSaga (arg: SagaArg<RenameFolderPayload>) {
  try {
    const { folderId, name, isCurrentFolder } = arg.payload;
    yield call(updateFolderName, folderId, name);
    if (isCurrentFolder) {
      yield put(fetchCurrentFolder(folderId));
    }
    yield put(fetchFolders());
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: renameFolder.getType(),
  saga: renameFolderSaga,
}
