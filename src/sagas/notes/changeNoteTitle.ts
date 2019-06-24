import { call, put } from 'redux-saga/effects';

import { changeNoteTitle, fetchFolderNotes, fetchCurrentNote } from 'actions/notes';
import { updateNoteTitle } from 'data/notes';
import { SagaArg } from 'types/saga';
import { ChangeNoteTitlePayload } from 'types/notes';

function* changeNoteTitleSaga(arg: SagaArg<ChangeNoteTitlePayload>) {
  try {
    const { id, title, folderId } = arg.payload;

    yield call(updateNoteTitle, id, title);
    if (folderId) {
      yield put(fetchFolderNotes(folderId));
      return;
    }

    yield put(fetchCurrentNote(id));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: changeNoteTitle.getType(),
  saga: changeNoteTitleSaga,
}
