import { put, call } from 'redux-saga/effects';

import { getAllNotes } from 'data/notes';
import { fetchNotes, saveNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { NoteFilter } from 'types/notes';

function* getFolderNotesSaga(arg: SagaArg<NoteFilter>) {
  try {
    const notes = yield call(getAllNotes, arg.payload);
    yield put(saveNotes(notes));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchNotes.getType(),
  saga: getFolderNotesSaga,
};
