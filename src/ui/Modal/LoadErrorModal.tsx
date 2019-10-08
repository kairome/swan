import React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

// components
import Button from 'ui/Button/Button';
import Modal from 'ui/Modal/Modal';

// types
import { ReduxState } from 'types/redux';

type MapState = ReturnType<typeof mapState>;
type Props = MapState;

const LoadErrorModal: React.FC<Props> = (props) => {
  const handleClear = () => {
    ipcRenderer.send('clear-data');
  };

  const renderFooter = () => (
    <Button
      text="Understood, clear all local data"
      theme="primary"
      shape="text"
      onClick={handleClear}
    />
  );

  return (
    <Modal
      show={props.show}
      footer={renderFooter()}
      title="Data corruption"
    >
      <div>There was a problem loading local files.</div>
      <div>Most likely causes:</div>
      <p>1. The database files were manually modified causing the data corruption.</p>
      <p>2. Files downloaded from Google Drive were encrypted with different password.</p>
      <div>Solutions:</div>
      <p>1. Clear all data</p>
      <p>
        2. When downloading previous version of files from Google Drive, make sure you use the same encryption
        password. If you cannot remember the password used for the previous synchronizations, simply opt in to
        upload the current version of files, effectively overwriting the previous versions.
      </p>
      <p>
        <b>
          Without the correct encryption password, files from Google Drive cannot be restored and data is lost
          forever.
        </b>
      </p>
    </Modal>
  );
};

const mapState = (state: ReduxState) => ({
  show: state.interactive.dbLoadError,
});

export default connect(mapState)(LoadErrorModal);
