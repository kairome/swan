import { call, put } from 'redux-saga/effects';
import { removeToDoList } from 'data/notes';

// actions
import { fetchCurrentNote, deleteToDoList } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { RemoveToDoListPayload } from 'types/notes';

function* deleteToDoListSaga (arg: SagaArg<RemoveToDoListPayload>) {
  try {
    const { noteId, listIndex } = arg.payload;
    yield call(removeToDoList, noteId, listIndex);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: deleteToDoList.getType(),
  saga: deleteToDoListSaga,
}
