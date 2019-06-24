import { call, put, select } from 'redux-saga/effects';
import { removeNoteById } from 'data/notes';

// actions
import { removeNote, fetchFolderNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { getCurrentFolderSelector } from 'selectors/folders';

function* removeNoteSaga(arg: SagaArg<string>) {
  try {
    yield call(removeNoteById, arg.payload);
    const currentFolder = yield select(getCurrentFolderSelector);
    if (currentFolder._id) {
      yield put(fetchFolderNotes(currentFolder._id));
    }
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: removeNote.getType(),
  saga: removeNoteSaga,
}
