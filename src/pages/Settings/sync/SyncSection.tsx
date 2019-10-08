import { ipcRenderer } from 'electron';
import React, { useState } from 'react';
import { connect } from 'react-redux';

// actions
import {
  fetchGoogleAuthToken,
  updateSyncFrequency,
} from 'actions/user';
import { dispatchToastr } from 'actions/toastr';

// components
import Button from 'ui/Button/Button';
import Options from 'ui/Options/Options';
import SyncControls from 'pages/Settings/sync/SyncControls';

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

  const renderSyncContent = () => {
    if (!encEnabled) {
      return (
        <React.Fragment>
          <Button
            text="Enable encryption"
            theme="primary"
            shape="text"
            onClick={props.toggleEncModal}
            className={s.enableEncButton}
          />
          to use google synchronization
        </React.Fragment>
      );
    }

    if (sync === null) {
      return (
        <Button
          text="Turn on synchronization"
          theme="primary"
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
      <React.Fragment>
        <div className={s.syncFrequency}>
          Sync frequency&nbsp;
          <Options
            value={currentSyncFrequency}
            options={syncOptions}
            onChange={handleSetSyncFrequency}
          />
        </div>
        <SyncControls sync={sync} />
      </React.Fragment>
    );
  };

  return (
    <div className={s.settingSectionActive}>
      <div className={s.sectionTitle}>Synchronization with Google Drive</div>
      <p>Synchronize all local data with your google drive</p>
      {renderSyncContent()}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  sync: state.user.sync,
});

const mapDispatch = {
  fetchGoogleAuthToken,
  dispatchToastr,
  updateSyncFrequency,
};

export default connect(mapState, mapDispatch)(SyncSection);
