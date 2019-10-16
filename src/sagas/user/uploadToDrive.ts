import {
  call,
  all,
  put,
  select,
} from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { getGoogleOAuth, UPLOAD_GOOGLE_DRIVE_URL } from 'utils/google';
import api from 'utils/api';
import { saveUserSyncData } from 'data/user';

// actions
import { saveUserSync, setIsFirstSync, uploadAppData } from 'actions/user';
import getAppFiles from 'sagas/user/getAppFiles';
import { toggleLoader } from 'actions/navigation';
import { toggleSyncMismatchModal } from 'actions/interactive';
import { dispatchToastr } from 'actions/toastr';

// types
import { SagaArg } from 'types/saga';
import { GoogleCredentials } from 'types/user';
import { ReduxState } from 'types/redux';

const firstSyncSelector = ({ user }: ReduxState) => user.sync && user.sync.firstTime;

const uploadToDriveRequest = async (token: string, payload: FormData, fileId: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const method = fileId ? 'PATCH' : 'POST';
  const fileIdUrl = fileId ? `/${fileId}` : '';
  const uploadType = fileId ? 'media' : 'multipart';
  return api(method, `${UPLOAD_GOOGLE_DRIVE_URL}${fileIdUrl}?uploadType=${uploadType}&fields=id`, payload, headers);
};

function* uploadToDriveSaga(arg: SagaArg<GoogleCredentials>) {
  try {
    yield put(toggleLoader({ sync: true }));
    const oauth = getGoogleOAuth(arg.payload);
    const appData = yield call(getAppFiles, oauth);
    const files = ipcRenderer.sendSync('get-app-files');
    const isFirstSync = yield select(firstSyncSelector);

    if (isFirstSync && !_.isEmpty(appData.files)) {
      yield put(toggleSyncMismatchModal());
      yield put(setIsFirstSync(false));
      yield put(toggleLoader({ sync: false }));
      return;
    }

    if (!_.isEmpty(files)) {
      const requests = _.map(_.keys(files), (fileName) => {
        const metadata = {
          name: fileName,
          mimeType: 'application/json',
          parents: ['appDataFolder'],
        };
        const existingFile = _.find(appData.files, f => f.name === fileName);
        const existingFileId = existingFile ? existingFile.id : '';
        const formData = new FormData();
        const fileBlob = new Blob([files[fileName]], { type: 'application/json' });
        if (!existingFileId) {
          formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        }
        formData.append('file', fileBlob, fileName);
        return call(uploadToDriveRequest, arg.payload.access_token, formData, existingFileId);
      });
      yield all(requests);
    }
    yield put(toggleLoader({ sync: false }));
  } catch (e) {
    const errMsg = _.get(e.response, ['data', 'error_description'], '');
    if (_.includes(errMsg, 'expired or revoked') && e.response.status === 400) {
      yield call(saveUserSyncData, null);
      yield put(saveUserSync(null));
      yield put(dispatchToastr({ message: 'Google token expired or revoked. Sync is turned off ' }));
    }
    yield put(toggleLoader({ sync: false }));
    console.error(e);
  }
}

export default {
  type: uploadAppData.getType(),
  saga: uploadToDriveSaga,
};
