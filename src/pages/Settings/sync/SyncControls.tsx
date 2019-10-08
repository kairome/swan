import React, { useState } from 'react';
import { connect } from 'react-redux';

// actions
import {
  downloadDriveFiles,
  removeDriveFiles,
  revokeGoogleCredentials,
  uploadAppData,
} from 'actions/user';
import { getLoader } from 'selectors/common';

// components
import Button from 'ui/Button/Button';
import Confirmation from 'ui/Confirmation/Confirmation';

// css
import s from 'pages/Settings/sync/SyncSection.css';

// types
import { UserSyncData } from 'types/user';
import { ReduxState } from 'types/redux';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & {
  sync: UserSyncData | null,
};

const SyncControls: React.FC<Props> = (props) => {
  const { sync } = props;
  const [turnOffConfirmation, setTurnOffConfirmation] = useState(false);
  const [replaceConfirmation, setReplaceConfirmation] = useState(false);
  const [removeConfirmation, setRemoveConfirmation] = useState(false);

  const toggleTurnOffConfirmation = () => {
    setTurnOffConfirmation(!turnOffConfirmation);
  };
  const toggleReplaceConfirmation = () => {
    setReplaceConfirmation(!replaceConfirmation);
  };
  const toggleRemoveConfirmation = () => {
    setRemoveConfirmation(!removeConfirmation);
  };

  const handleSignOut = () => {
    if (sync !== null) {
      props.revokeGoogleCredentials(sync.googleCredentials.refresh_token);
    }

    toggleTurnOffConfirmation();
  };

  const handleDownload = () => {
    if (sync !== null) {
      props.downloadDriveFiles(sync.googleCredentials);
    }
  };

  const handleSync = () => {
    if (sync !== null) {
      props.uploadAppData(sync.googleCredentials);
    }
  };

  const handleRemoveFiles = () => {
    if (sync !== null) {
      props.removeDriveFiles(sync.googleCredentials);
    }

    toggleRemoveConfirmation();
  };

  return (
    <React.Fragment>
      <div className={s.sectionButtons}>
        <Button
          text="Turn off synchronization"
          theme="primary"
          onClick={toggleTurnOffConfirmation}
          className={s.sectionButton}
          disabled={props.syncLoading}
        />
        <Button
          text="Manual sync"
          theme="primary"
          shape="outline"
          onClick={handleSync}
          className={s.sectionButton}
          disabled={props.syncLoading}
        />
        <Button
          text="Replace with drive files"
          theme="primary"
          shape="outline"
          onClick={toggleReplaceConfirmation}
          className={s.sectionButton}
          disabled={props.syncLoading}
        />
      </div>
      <Button
        text="Delete all drive files"
        theme="danger"
        onClick={toggleRemoveConfirmation}
        className={s.sectionButton}
        disabled={props.syncLoading}
      />
      <Confirmation
        show={turnOffConfirmation}
        toggle={toggleTurnOffConfirmation}
        message="Are you sure you want to turn off synchronization?"
        confirm={handleSignOut}
      />
      <Confirmation
        show={replaceConfirmation}
        toggle={toggleReplaceConfirmation}
        confirm={handleDownload}
        message=""
      >
        <div>Are you sure you want to replace all local files with the version stored on Google Drive?</div>
        <p>All local data that was not backed up will be lost.</p>
      </Confirmation>
      <Confirmation
        show={removeConfirmation}
        toggle={toggleRemoveConfirmation}
        message="Are you sure you want to delete drive files? All previously backed up data will be destroyed."
        confirm={handleRemoveFiles}
      />
    </React.Fragment>
  );
};

const mapDispatch = {
  uploadAppData,
  revokeGoogleCredentials,
  downloadDriveFiles,
  removeDriveFiles,
};

const mapState = (state: ReduxState) => ({
  syncLoading: getLoader(state, 'sync'),
});

export default connect(mapState, mapDispatch)(SyncControls);
