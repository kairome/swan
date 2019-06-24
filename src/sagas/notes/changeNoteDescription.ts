import { call, put } from 'redux-saga/effects';

import { changeNoteDescription, fetchCurrentNote } from 'actions/notes';
import { updateNoteDescription } from 'data/notes';
import { SagaArg } from 'types/saga';
import { ChangeNoteDescriptionPayload } from 'types/notes';

function* changeNoteDescriptionSaga(arg: SagaArg<ChangeNoteDescriptionPayload>) {
  try {
    const { id, description } = arg.payload;

    yield call(updateNoteDescription, id, description);
    yield put(fetchCurrentNote(id));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: changeNoteDescription.getType(),
  saga: changeNoteDescriptionSaga,
}
