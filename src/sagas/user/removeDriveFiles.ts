import { call, all, put } from 'redux-saga/effects';
import _ from 'lodash';
import { getGoogleOAuth } from 'utils/google';
import { google } from 'googleapis';

// actions
import { removeDriveFiles } from 'actions/user';
import getAppFiles from 'sagas/user/getAppFiles';
import { toggleLoader } from 'actions/navigation';
import { dispatchToastr } from 'actions/toastr';

// types
import { SagaArg } from 'types/saga';
import { GoogleCredentials } from 'types/user';

const removeFilesRequest = async (oauthClient: any, fileId: string) => {
  const drive = google.drive({
    version: 'v3',
    auth: oauthClient,
  });
  return drive.files.delete({
    fileId,
  });
};

function* removeDriveFilesSaga(arg: SagaArg<GoogleCredentials>) {
  try {
    yield put(toggleLoader({ sync: true }));
    const oauth = getGoogleOAuth(arg.payload);
    const appData = yield call(getAppFiles, oauth);

    if (!_.isEmpty(appData.files)) {
      const requests = _.map(appData.files, file => call(removeFilesRequest, oauth, file.id));
      yield all(requests);
      yield put(dispatchToastr({ message: 'Drive files deleted.' }));
    }

    yield put(toggleLoader({ sync: false }));
  } catch (e) {
    yield put(toggleLoader({ sync: false }));
    console.error(e);
  }
}

export default {
  type: removeDriveFiles.getType(),
  saga: removeDriveFilesSaga,
};
