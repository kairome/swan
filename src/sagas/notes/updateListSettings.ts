import { call, put } from 'redux-saga/effects';
import { updateToDoListSettings } from 'data/notes';

// actions
import { fetchCurrentNote, updateListSettings } from 'actions/notes';

// types
import { SagaArg } from 'types/saga';
import { UpdateListSettingsPayload } from 'types/notes';

function* updateListSettingsSaga (arg: SagaArg<UpdateListSettingsPayload>) {
  try {
    const { noteId, listId, settings } = arg.payload;
    yield call(updateToDoListSettings, listId, settings);
    yield put(fetchCurrentNote(noteId));
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: updateListSettings.getType(),
  saga: updateListSettingsSaga,
}
