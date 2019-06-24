import { call, put } from 'redux-saga/effects';
import { updateToDoLists } from 'data/notes';

// actions
import { fetchCurrentNote, saveToDoLists } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateTodosPayload } from 'types/notes';

function* updateNoteToDosSaga (arg: SagaArg<UpdateTodosPayload>) {
  try {
    const { id, lists } = arg.payload;
    yield call(updateToDoLists, id, lists);
    yield put(fetchCurrentNote(id));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: saveToDoLists.getType(),
  saga: updateNoteToDosSaga,
}
