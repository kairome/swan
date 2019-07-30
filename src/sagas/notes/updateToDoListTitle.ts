import { call, put } from 'redux-saga/effects';
import { updateListTitle } from 'data/notes';

// actions
import { fetchCurrentNote, updateToDoListTitle } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateToDoListTitlePayload } from 'types/notes';

function* updateToDoListTitleSaga(arg: SagaArg<UpdateToDoListTitlePayload>) {
  try {
    const { noteId, title, listId } = arg.payload;
    yield call(updateListTitle, listId, title);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateToDoListTitle.getType(),
  saga: updateToDoListTitleSaga,
};
