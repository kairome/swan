import { ipcRenderer } from 'electron';
import React, { useState } from 'react';
import { connect } from 'react-redux';

// actions
import {
  downloadDriveFiles,
  fetchGoogleAuthToken,
  removeDriveFiles,
  revokeGoogleCredentials,
  updateSyncFrequency,
  uploadAppData,
} from 'actions/user';
import { dispatchToastr } from 'actions/toastr';

// components
import Button from 'ui/Button/Button';
import Options from 'ui/Options/Options';

// types
import { ReduxState } from 'types/redux';

// css
import s from './SyncSection.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & {
  toggleEncModal: () => void,
};

const SyncSection: React.FC<Props> = (props) => {
  const { sync } = props;
  const [currentSyncFrequency, setSyncFrequency] = useState(sync ? sync.syncFrequency : 30);
  const encEnabled = ipcRenderer.sendSync('get-auth-status');

  ipcRenderer.on('google-sign-in-code', (event: any, code: string) => {
    props.fetchGoogleAuthToken(code);
  });

  ipcRenderer.on('google-sign-in-failed', () => {
    props.dispatchToastr({ message: 'Error occurred while signing in to google.' });
  });

  const handleSetSyncFrequency = (value: number) => {
    props.updateSyncFrequency(value);
    setSyncFrequency(value);
  };

  const handleSignIn = () => {
    ipcRenderer.send('google-sign-in');
  };

  const handleSignOut = () => {
    if (sync !== null) {
      props.revokeGoogleCredentials(sync.googleCredentials.refresh_token);
    }
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
  };

  const renderSyncContent = () => {
    if (!encEnabled) {
      return (
        <div>
          <div onClick={props.toggleEncModal}>Turn on encryption</div>
          to use google synchronization
        </div>
      );
    }

    if (sync === null) {
      return (
        <Button
          text="Turn on synchronization"
          theme="info"
          onClick={handleSignIn}
        />
      );
    }

    const syncOptions = [
      {
        value: 0,
        label: 'off',
      },
      {
        value: 5,
        label: '5 minutes',
      },
      {
        value: 15,
        label: '15 minutes',
      },
      {
        value: 30,
        label: '30 minutes',
      },
      {
        value: 45,
        label: '45 minutes',
      },
      {
        value: 60,
        label: '1 hour',
      },
    ];

    return (
      <div>
        <div>Sync is turned on!</div>
        <div className={s.syncFrequency}>
          Sync frequency&nbsp;
          <Options
            value={currentSyncFrequency}
            options={syncOptions}
            onChange={handleSetSyncFrequency}
          />
        </div>
        <div className={s.sectionButtons}>
          <Button
            text="Turn off synchronization"
            theme="info"
            onClick={handleSignOut}
            className={s.sectionButton}
          />
          <Button
            text="Download"
            theme="info"
            onClick={handleDownload}
            className={s.sectionButton}
          />
          <Button
            text="Manual sync"
            theme="info"
            onClick={handleSync}
            className={s.sectionButton}
          />
          <Button
            text="Delete all drive files"
            theme="info"
            onClick={handleRemoveFiles}
            className={s.sectionButton}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3>Synchronization with Google Drive</h3>
      <p>
        Synchronize all local data with your google drive
      </p>
      {renderSyncContent()}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  sync: state.user.sync,
});

const mapDispatch = {
  fetchGoogleAuthToken,
  revokeGoogleCredentials,
  dispatchToastr,
  downloadDriveFiles,
  uploadAppData,
  removeDriveFiles,
  updateSyncFrequency,
};

export default connect(mapState, mapDispatch)(SyncSection);
