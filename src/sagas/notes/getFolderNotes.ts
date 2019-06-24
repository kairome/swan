import { put, call } from 'redux-saga/effects';

import { getNotesByFolder } from 'data/notes';
import { fetchFolderNotes, saveFolderNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';

function* getFolderNotesSaga (arg: SagaArg<string>) {
  try {
    const notes = yield call(getNotesByFolder, arg.payload);
    yield put(saveFolderNotes(notes));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchFolderNotes.getType(),
  saga: getFolderNotesSaga,
}
