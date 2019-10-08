import { call, put, select } from 'redux-saga/effects';
import { updateAllNotesFolder, updateNotesFolder } from 'data/notes';
import _ from 'lodash';
import history from 'utils/history';

// actions
import { fetchCurrentNote, fetchNotes, moveNotesToFolder } from 'actions/notes';
import { resetNotesToMove, toggleMoveNotes } from 'actions/interactive';

// types
import { SagaArg } from 'types/saga';
import { MoveNotesPayload } from 'types/notes';
import { dispatchToastr } from 'actions/toastr';
import { getPathname } from 'selectors/common';

function* moveNotesToFolderSaga(arg: SagaArg<MoveNotesPayload>) {
  try {
    const { noteIds, moveTo, moveFrom } = arg.payload;
    const movingAll = _.isEmpty(noteIds);
    if (movingAll) {
      yield call(updateAllNotesFolder, moveFrom, moveTo);
      history.push(`/folders/${moveTo}`);
    } else {
      yield call(updateNotesFolder, moveFrom, moveTo, noteIds);
    }

    const pathname = yield select(getPathname);
    const notePlural = noteIds.length > 1 ? 'Notes' : 'Note';
    const message = !movingAll ? `${notePlural} moved.` : 'All folder notes moved.';

    if (!movingAll && pathname.includes('/folders')) {
      yield put(fetchNotes({ folderId: moveFrom }));
    }

    if (!movingAll && noteIds.length === 1 && pathname.includes('/notes')) {
      yield put(fetchCurrentNote(noteIds[0]));
    }

    yield put(dispatchToastr({ message }));

    yield put(toggleMoveNotes());
    yield put(resetNotesToMove());
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: moveNotesToFolder.getType(),
  saga: moveNotesToFolderSaga,
};
