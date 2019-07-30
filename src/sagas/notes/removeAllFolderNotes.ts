import { call } from 'redux-saga/effects';
import { removeNotesByFolder } from 'data/notes';

// actions
import { removeAllFolderNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';

function* removeNoteSaga(arg: SagaArg<string>) {
  try {
    yield call(removeNotesByFolder, arg.payload);
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: removeAllFolderNotes.getType(),
  saga: removeNoteSaga,
};
