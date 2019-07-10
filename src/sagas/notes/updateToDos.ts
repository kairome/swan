import { call, put } from 'redux-saga/effects';
import { updateToDos } from 'data/notes';

// actions
import { fetchCurrentNote, updateToDoList } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateToDoListPayload } from 'types/notes';

function* updateNoteToDosSaga (arg: SagaArg<UpdateToDoListPayload>) {
  try {
    const { noteId, list, listIndex } = arg.payload;
    yield call(updateToDos, noteId, listIndex, list);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateToDoList.getType(),
  saga: updateNoteToDosSaga,
}
