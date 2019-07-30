import { call, put } from 'redux-saga/effects';
import { updateAllNotesFolder, updateNotesFolder } from 'data/notes';
import _ from 'lodash';
import history from 'utils/history';

// actions
import { moveNotesToFolder } from 'actions/notes';
import { resetNotesToMove, toggleMoveNotes } from 'actions/interactive';

// types
import { SagaArg } from 'types/saga';
import { MoveNotesPayload } from 'types/notes';

function* moveNotesToFolderSaga(arg: SagaArg<MoveNotesPayload>) {
  try {
    const { noteIds, moveTo, moveFrom } = arg.payload;
    if (_.isEmpty(noteIds)) {
      yield call(updateAllNotesFolder, moveFrom, moveTo);
    } else {
      yield call(updateNotesFolder, moveFrom, moveTo, noteIds);
    }

    yield put(toggleMoveNotes());
    yield put(resetNotesToMove());
    history.push(`/folders/${moveTo}`);
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: moveNotesToFolder.getType(),
  saga: moveNotesToFolderSaga,
};
