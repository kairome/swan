import React from 'react';
import s from 'ui/Modal/Modal.css';
import { ReduxState } from 'types/redux';
import { connect } from 'react-redux';
import Button from 'ui/Button/Button';
import { ipcRenderer } from 'electron';

type MapState = ReturnType<typeof mapState>;
type Props = MapState;

const LoadErrorModal: React.FC<Props> = (props) => {
  if (!props.show) {
    return null;
  }

  const handleClear = () => {
    ipcRenderer.send('clear-data');
  };

  return (
    <div className={s.modalContainer}>
      <div className={s.modalCover} />
      <div />
      <div className={s.modalBody}>
        <div>
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
          <Button
            text="Understood, clear all local data"
            theme="info"
            onClick={handleClear}
          />
        </div>
      </div>
    </div>
  );
};

const mapState = (state: ReduxState) => {
  return {
    show: state.interactive.dbLoadError,
  };
};

export default connect(mapState)(LoadErrorModal);
