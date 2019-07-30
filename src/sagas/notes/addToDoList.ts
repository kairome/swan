import { call, put } from 'redux-saga/effects';
import { addNoteToDoList } from 'data/notes';

// actions
import { fetchCurrentNote, addToDoList } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { AddToDoListPayload } from 'types/notes';

function* addNoteToDoSaga(arg: SagaArg<AddToDoListPayload>) {
  try {
    const { noteId, list } = arg.payload;
    yield call(addNoteToDoList, noteId, list);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: addToDoList.getType(),
  saga: addNoteToDoSaga,
};
