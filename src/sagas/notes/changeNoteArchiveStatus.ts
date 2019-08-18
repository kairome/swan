import { call, put } from 'redux-saga/effects';

import { changeNoteArchiveStatus, fetchCurrentNote, fetchNotes } from 'actions/notes';
import { updateNoteArchiveStatus } from 'data/notes';
import { SagaArg } from 'types/saga';
import { ArchiveNotePayload } from 'types/notes';
import history from 'utils/history';
import { dispatchToastr } from 'actions/toastr';

function* changeNoteTextSaga(arg: SagaArg<ArchiveNotePayload>) {
  try {
    const {
      noteId,
      isArchived,
      folderId,
      inList,
    } = arg.payload;

    yield call(updateNoteArchiveStatus, noteId, isArchived);
    const message = isArchived ? 'Note archived.' : 'Note restored.';
    yield put(dispatchToastr({ message }));
    if (inList) {
      const filter = {
        isArchived: !isArchived,
        folderId: isArchived ? folderId : undefined,
      };
      yield put(fetchNotes(filter));
      return;
    }

    // if isArchived === true, archive operation from page, redirect to folder
    if (isArchived) {
      yield put(fetchNotes({ folderId }));
      history.push(`/folders/${folderId}`);
      return;
    }

    // if false, restore operation from page, stay on the page
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: changeNoteArchiveStatus.getType(),
  saga: changeNoteTextSaga,
};
