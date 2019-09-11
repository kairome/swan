import { call, all } from 'redux-saga/effects';
import _ from 'lodash';
import { getGoogleOAuth } from 'utils/google';
import { ipcRenderer } from 'electron';

// actions
import { downloadDriveFiles } from 'actions/user';
import getAppFiles from 'sagas/user/getAppFiles';
import downloadAppFile from 'sagas/user/downloadAppFile';

// types
import { SagaArg } from 'types/saga';
import { GoogleCredentials } from 'types/user';
import { DownloadFileResult } from 'types/entities';

function* downloadDriveFileSaga(arg: SagaArg<GoogleCredentials>) {
  try {
    const oauth = getGoogleOAuth(arg.payload);
    const appData = yield call(getAppFiles, oauth);
    if (!_.isEmpty(appData.files)) {
      const requests = _.map(appData.files, file =>
        call(downloadAppFile, arg.payload.access_token, file.id, file.name));
      const results: DownloadFileResult[] = yield all(requests);
      const files = _.reduce(_.compact(results), (acc, result) => ({
        ...acc,
        [result.fileName]: result.fileContent,
      }), {});
      ipcRenderer.send('restore-from-google', files);
    }
  } catch (e) {
    console.error(e);
  }
}

export default {
  type: downloadDriveFiles.getType(),
  saga: downloadDriveFileSaga,
};
