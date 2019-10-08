import { call, put } from '@redux-saga/core/effects';
import { updateNoteItems } from 'data/notes';
import { fetchNotes, updateNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateNotesPayload } from 'types/notes';

function* updateNotesSaga(arg: SagaArg<UpdateNotesPayload>) {
  try {
    const { list, ...filter } = arg.payload;
    yield call(updateNoteItems, list);
    yield put(fetchNotes(filter));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateNotes.getType(),
  saga: updateNotesSaga,
};
