import { call, all, put } from 'redux-saga/effects';
import _ from 'lodash';
import { getGoogleOAuth } from 'utils/google';
import { google } from 'googleapis';

// actions
import { removeDriveFiles } from 'actions/user';
import getAppFiles from 'sagas/user/getAppFiles';

// types
import { SagaArg } from 'types/saga';
import { GoogleCredentials } from 'types/user';
import { dispatchToastr } from 'actions/toastr';

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
    const oauth = getGoogleOAuth(arg.payload);
    const appData = yield call(getAppFiles, oauth);

    if (!_.isEmpty(appData.files)) {
      const requests = _.map(appData.files, file => call(removeFilesRequest, oauth, file.id));
      yield all(requests);
      yield put(dispatchToastr({ message: 'Drive files deleted.' }));
    }
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: removeDriveFiles.getType(),
  saga: removeDriveFilesSaga,
};
