import _ from 'lodash';
import { all, fork, takeLatest } from 'redux-saga/effects';
import { Saga } from 'types/saga';

// sagas
import getAllFolders from 'sagas/folders/getAllFolders';
import folders from './folders';
import notes from './notes';

export default function* rootSaga() {
  const allSagas: Saga[] = [
    ...folders,
    ...notes,
  ];

  const mapSagas = _.map(allSagas, function* ({ type, saga }) {
    return yield takeLatest(type, saga);
  });

  yield fork(getAllFolders.saga);
  yield all(mapSagas);
}
