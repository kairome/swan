import { call, put } from 'redux-saga/effects';
import { removeNoteById } from 'data/notes';
import history from 'utils/history';

// actions
import { removeNote, fetchNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { RemoveNotePayload } from 'types/notes';

function* removeNoteSaga(arg: SagaArg<RemoveNotePayload>) {
  try {
    const {
      noteId, folderId, isArchived, inList,
    } = arg.payload;
    yield call(removeNoteById, noteId);
    if (inList) {
      const filter = {
        isArchived,
        folderId: !isArchived ? folderId : undefined,
      };
      yield put(fetchNotes(filter));
      return;
    }

    history.push(`/folders/${folderId}`);
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: removeNote.getType(),
  saga: removeNoteSaga,
};
