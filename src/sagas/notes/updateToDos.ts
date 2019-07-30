import { call, put } from 'redux-saga/effects';
import { updateListToDos } from 'data/notes';

// actions
import { fetchCurrentNote, updateToDoListItems } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateToDoListItemsPayload } from 'types/notes';

function* updateToDosSaga (arg: SagaArg<UpdateToDoListItemsPayload>) {
  try {
    const { noteId, items, listId } = arg.payload;
    yield call(updateListToDos, listId, items);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateToDoListItems.getType(),
  saga: updateToDosSaga,
}
