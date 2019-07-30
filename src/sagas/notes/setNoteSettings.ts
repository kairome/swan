import { call, put } from 'redux-saga/effects';
import { updateNoteContentSettings } from 'data/notes';

// actions
import { fetchCurrentNote, setNoteContentSettings } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateNoteContentSettingsPayload } from 'types/notes';

function* setNoteSettingsSaga(arg: SagaArg<UpdateNoteContentSettingsPayload>) {
  try {
    const { noteId, contentSettings } = arg.payload;
    yield call(updateNoteContentSettings, noteId, contentSettings);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: setNoteContentSettings.getType(),
  saga: setNoteSettingsSaga,
};
