import { put, call } from 'redux-saga/effects';

import { getAllNotes } from 'data/notes';
import { fetchNotes, saveNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { NoteFilter } from 'types/notes';
import { toggleLoader } from 'actions/navigation';

function* getFolderNotesSaga(arg: SagaArg<NoteFilter>) {
  try {
    const { withoutLoader, ...payload } = arg.payload;
    if (!withoutLoader) {
      yield put(toggleLoader({ notes: true }));
    }
    const notes = yield call(getAllNotes, payload);
    yield put(saveNotes(notes));
    yield put(toggleLoader({ notes: false }));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: fetchNotes.getType(),
  saga: getFolderNotesSaga,
};
