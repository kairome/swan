import { call, put } from 'redux-saga/effects';
import { insertNote } from 'data/notes';

// actions
import { addNote, fetchFolderNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { AddNotePayload } from 'types/notes';

function* addNoteSaga (arg: SagaArg<AddNotePayload>) {
  try {
    const newNote = {
      ...arg.payload,
      todoLists: [],
      contentSettings: {
        hideTextEditor: false,
        hideLists: false,
      },
    };
    yield call(insertNote, newNote);
    yield put(fetchFolderNotes(arg.payload.folder));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: addNote.getType(),
  saga: addNoteSaga,
}
