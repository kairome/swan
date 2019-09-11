import React, { useEffect, useRef, useState } from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';

// actions
import { fetchFolders } from 'actions/folders';
import { fetchUserSyncData, uploadAppData } from 'actions/user';

// components
import Navigation from 'ui/Navigation/Navigation';
import Main from 'pages/Main/Main';
import Auth from 'pages/Auth/Auth';

// types
import { ReduxState } from 'types/redux';
import LoadErrorModal from 'ui/Modal/LoadErrorModal';
import SyncMismatchModal from 'ui/Modal/SyncMismatchModal';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;
const App: React.FC<Props> = (props) => {
  const [showAuth, setShowAuth] = useState(ipcRenderer.sendSync('get-auth-status'));
  const interval = useRef<number | null>(null);

  if (!showAuth) {
    ipcRenderer.send('init');
  }

  ipcRenderer.on('load-app', () => {
    setShowAuth(false);
  });

  ipcRenderer.on('hash-changed', () => {
    if (props.googleCredentials !== null) {
      props.uploadAppData(props.googleCredentials);
    }
  });

  const clearSyncInterval = () => {
    if (interval.current !== null) {
      clearInterval(interval.current);
      interval.current = null;
    }
  };

  const createSyncInterval = () => {
    const intervalMs = props.syncFrequency * 60 * 1000;
    if (intervalMs === 0) {
      return;
    }

    interval.current = window.setInterval(() => {
      if (props.googleCredentials !== null) {
        props.uploadAppData(props.googleCredentials);
      }
    }, intervalMs);
  };

  useEffect(() => {
    if (!showAuth) {
      props.fetchFolders();
      props.fetchUserSyncData();
    }
  }, [showAuth]);

  useEffect(() => {
    clearSyncInterval();
    if (props.googleCredentials !== null) {
      props.uploadAppData(props.googleCredentials);
      createSyncInterval();
    }


    return () => clearSyncInterval();
  }, [props.googleCredentials, props.syncFrequency, clearSyncInterval, createSyncInterval]);

  if (showAuth) {
    return (
      <Auth />
    );
  }

  return (
    <React.Fragment>
      <Navigation />
      <Main />
      <LoadErrorModal />
      <SyncMismatchModal />
    </React.Fragment>
  );
};

const mapState = (state: ReduxState) => {
  const { sync } = state.user;
  return {
    googleCredentials: sync !== null ? sync.googleCredentials : null,
    syncFrequency: sync !== null ? sync.syncFrequency : 30,
  };
};

const mapDispatch = {
  fetchFolders,
  fetchUserSyncData,
  uploadAppData,
};

export default connect(mapState, mapDispatch)(App);
