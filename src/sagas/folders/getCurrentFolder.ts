import { put, call } from 'redux-saga/effects';

import { fetchCurrentFolder, saveCurrentFolder } from 'actions/folders';
import { SagaArg } from 'types/saga';
import { getFolderById } from 'data/folders';
import { fetchNotes } from 'actions/notes';
import { FolderItem } from 'types/folders';
import { toggleLoader } from 'actions/navigation';

function* getCurrentFolderSaga(arg: SagaArg<string>) {
  try {
    yield put(toggleLoader({ currentFolder: true }));
    const currentFolder: FolderItem | null = yield call(getFolderById, arg.payload);
    if (currentFolder === null) {
      yield put(toggleLoader({ currentFolder: false }));
      return;
    }

    yield put(saveCurrentFolder(currentFolder));
    yield put(fetchNotes({ folderId: currentFolder._id }));
    yield put(toggleLoader({ currentFolder: false }));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchCurrentFolder.getType(),
  saga: getCurrentFolderSaga,
};
