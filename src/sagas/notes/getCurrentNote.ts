import { put, call, select } from 'redux-saga/effects';

import { fetchCurrentNote, saveCurrentNote } from 'actions/notes';
import { SagaArg } from 'types/saga';
import { getNoteById } from 'data/notes';
import { getCurrentFolderSelector } from 'selectors/folders';
import { FolderItem } from 'types/folders';
import { fetchCurrentFolder } from 'actions/folders';

function* getCurrentNoteSaga (arg: SagaArg<string>) {
  try {

    const currentNote = yield call(getNoteById, arg.payload);
    if (currentNote == null) {
      return;
    }

    const currentFolder: FolderItem = yield select(getCurrentFolderSelector);
    if (currentFolder._id !== currentNote.folder) {
      yield put(fetchCurrentFolder(currentNote.folder));
    }

    yield put(saveCurrentNote(currentNote));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchCurrentNote.getType(),
  saga: getCurrentNoteSaga,
}
