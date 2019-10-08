import React from 'react';
import { connect } from 'react-redux';

// actions
import { toggleSyncMismatchModal } from 'actions/interactive';
import { downloadDriveFiles, uploadAppData } from 'actions/user';

// components
import Modal from 'ui/Modal/Modal';
import Button from 'ui/Button/Button';

// types
import { ReduxState } from 'types/redux';

// css
import s from './Modal.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const SyncMismatchModal: React.FC<Props> = (props) => {
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

  const renderFooter = () => (
    <div className={s.syncModalFooter}>
      <Button
        text="Do nothing"
        theme="primary"
        shape="text"
        onClick={handleClose}
      />
      <Button
        text="Download from Google Drive and replace local files"
        theme="primary"
        shape="text"
        onClick={handleDownload}
      />
      <Button
        text="Upload local files to Google Drive"
        theme="primary"
        shape="text"
        onClick={handleUpload}
      />
    </div>
  );

  return (
    <Modal
      show={props.show}
      footer={renderFooter()}
      title="Old backup files"
    >
      <div>You already have backup files stored on Google Drive.</div>
      <p>
        If you choose to download from Google Drive, make sure that you use the same encryption password that was used
        for the previous version.
      </p>
      <div>
        Otherwise it will lead to <b>data corruption</b>.
      </div>
    </Modal>
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
