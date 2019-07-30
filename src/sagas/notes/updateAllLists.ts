import { call, put } from 'redux-saga/effects';
import { updateToDoLists } from 'data/notes';

// actions
import { fetchCurrentNote, updateAllLists } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateAllListsPayload } from 'types/notes';

function* updateAllListsSaga(arg: SagaArg<UpdateAllListsPayload>) {
  try {
    const { noteId, lists } = arg.payload;
    yield call(updateToDoLists, noteId, lists);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateAllLists.getType(),
  saga: updateAllListsSaga,
};
