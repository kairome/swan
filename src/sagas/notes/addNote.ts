import { call, put, select } from 'redux-saga/effects';
import { insertNote } from 'data/notes';
import history from 'utils/history';

// actions
import { getNotesLength } from 'selectors/notes';
import { addNote, fetchNotes } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { AddNotePayload } from 'types/notes';

function* addNoteSaga(arg: SagaArg<AddNotePayload>) {
  try {
    const { title, folder, copy } = arg.payload;
    const order = yield select(getNotesLength);
    const newNote = {
      title,
      folder,
      order,
      todoLists: [],
      text: '',
      contentSettings: {
        hideTextEditor: false,
        hideLists: false,
        lockEditorHeight: false,
      },
      isArchived: false,
    };

    const note = copy !== undefined ? { ...copy } : newNote;

    const result = yield call(insertNote, note);
    if (copy !== undefined) {
      history.push(`/notes/${result._id}`);
    }
    yield put(fetchNotes({ folderId: arg.payload.folder }));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: addNote.getType(),
  saga: addNoteSaga,
};
