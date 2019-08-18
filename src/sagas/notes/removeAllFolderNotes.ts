import { call, put } from 'redux-saga/effects';
import { removeNotesByFolder } from 'data/notes';

// actions
import { removeAllFolderNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { dispatchToastr } from 'actions/toastr';

function* removeNoteSaga(arg: SagaArg<string>) {
  try {
    yield call(removeNotesByFolder, arg.payload);

    yield put(dispatchToastr({ message: 'All folder notes removed.' }));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: removeAllFolderNotes.getType(),
  saga: removeNoteSaga,
};
