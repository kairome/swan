import { call, put } from 'redux-saga/effects';

import { changeNoteTitle, fetchNotes, fetchCurrentNote } from 'actions/notes';
import { updateNoteTitle } from 'data/notes';
import { SagaArg } from 'types/saga';
import { ChangeNoteTitlePayload } from 'types/notes';

function* changeNoteTitleSaga(arg: SagaArg<ChangeNoteTitlePayload>) {
  try {
    const {
      id, title, folderId, noteArchived,
    } = arg.payload;

    yield call(updateNoteTitle, id, title);
    if (folderId !== undefined && noteArchived !== undefined) {
      const filter = {
        isArchived: noteArchived,
        folderId: !noteArchived ? folderId : undefined,
        withoutLoader: true,
      };
      yield put(fetchNotes(filter));
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
};
