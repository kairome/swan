import { call, put } from 'redux-saga/effects';
import { updateAllNotesFolder, updateNotesFolder } from 'data/notes';
import _ from 'lodash';
import history from 'utils/history';

// actions
import { fetchNotes, moveNotesToFolder } from 'actions/notes';
import { resetNotesToMove, toggleMoveNotes } from 'actions/interactive';

// types
import { SagaArg } from 'types/saga';
import { MoveNotesPayload } from 'types/notes';
import { dispatchToastr } from 'actions/toastr';

function* moveNotesToFolderSaga(arg: SagaArg<MoveNotesPayload>) {
  try {
    const { noteIds, moveTo, moveFrom } = arg.payload;
    const movingAll = _.isEmpty(noteIds);
    if (movingAll) {
      yield call(updateAllNotesFolder, moveFrom, moveTo);
      history.push(`/folders/${moveTo}`);
    } else {
      yield call(updateNotesFolder, moveFrom, moveTo, noteIds);
      yield put(fetchNotes({ folderId: moveFrom }));
    }

    const notePlural = noteIds.length > 1 ? 'Notes' : 'Note';
    const message = !movingAll ? `${notePlural} moved.` : 'All folder notes moved.';
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
