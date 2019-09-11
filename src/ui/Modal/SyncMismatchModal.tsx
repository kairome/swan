import React from 'react';
import s from 'ui/Modal/Modal.css';
import { ReduxState } from 'types/redux';
import { connect } from 'react-redux';
import Button from 'ui/Button/Button';
import { toggleSyncMismatchModal } from 'actions/interactive';
import { downloadDriveFiles, uploadAppData } from 'actions/user';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const SyncMismatchModal: React.FC<Props> = (props) => {
  if (!props.show) {
    return null;
  }

  const { sync } = props;

  const handleUpload = () => {
    if (sync !== null) {
      props.uploadAppData(sync.googleCredentials);
      props.toggleSyncMismatchModal();
    }
  };

  const handleDownload = () => {
    if (sync !== null) {
      props.downloadDriveFiles(sync.googleCredentials);
    }
  };

  const handleClose = () => {
    props.toggleSyncMismatchModal();
  };

  return (
    <div className={s.modalContainer}>
      <div className={s.modalCover} />
      <div />
      <div className={s.modalBody}>
        <div>
          <div>You already have backup files stored on Google Drive</div>
          <p>
            <b>
              If you choose to download from Google Drive, make sure that you use the same encryption password.
              Otherwise it will lead to data corruption.
            </b>
          </p>
          <Button
            text="Upload local files to Google Drive"
            theme="info"
            onClick={handleUpload}
          />
          <Button
            text="Download from Google Drive and replace local files"
            theme="info"
            onClick={handleDownload}
          />
          <Button
            text="Do nothing"
            theme="info"
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  show: state.interactive.syncMismatch,
  sync: state.user.sync,
});

const mapDispatch = {
  toggleSyncMismatchModal,
  downloadDriveFiles,
  uploadAppData,
};

export default connect(mapState, mapDispatch)(SyncMismatchModal);
