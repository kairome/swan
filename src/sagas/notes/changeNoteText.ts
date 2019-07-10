import { call, put } from 'redux-saga/effects';

import { changeNoteText, fetchCurrentNote } from 'actions/notes';
import { updateNoteText } from 'data/notes';
import { SagaArg } from 'types/saga';
import { UpdateNoteTextPayload } from 'types/notes';

function* changeNoteTextSaga(arg: SagaArg<UpdateNoteTextPayload>) {
  try {
    const { id, text } = arg.payload;

    yield call(updateNoteText, id, text);

    yield put(fetchCurrentNote(id));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: changeNoteText.getType(),
  saga: changeNoteTextSaga,
}
