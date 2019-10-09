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
import LoadErrorModal from 'ui/Modal/LoadErrorModal';
import SyncMismatchModal from 'ui/Modal/SyncMismatchModal';
import Transition from 'ui/Transition/Transition';
import SyncNotification from 'ui/Toastr/SyncNotification';

// types
import { ReduxState } from 'types/redux';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;
type Theme = 'light' | 'dark';

const App: React.FC<Props> = (props) => {
  const [showAuth, setShowAuth] = useState(ipcRenderer.sendSync('get-auth-status'));
  const interval = useRef<number | null>(null);

  const updateTheme = () => {
    const theme: Theme = ipcRenderer.sendSync('get-theme');
    document.documentElement.setAttribute('class', theme);
  };

  const updateAccentColor = () => {
    const accentColor: string = ipcRenderer.sendSync('get-accent-color');
    document.documentElement.style.setProperty('--accent-color', accentColor);
  };

  useEffect(() => {
    ipcRenderer.on('load-app', () => {
      setShowAuth(false);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on('update-theme', () => {
      updateTheme();
    });

    ipcRenderer.on('update-accent-color', () => {
      updateAccentColor();
    });

    updateTheme();
    updateAccentColor();
  }, [updateTheme, updateAccentColor]);

  if (!showAuth) {
    ipcRenderer.send('init');
  }

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

  return (
    <React.Fragment>
      <Auth show={showAuth || props.lockApp} />
      <Transition
        show={!showAuth && !props.lockApp}
        duration={150}
        delay={200}
        passThrough
      >
        <React.Fragment>
          <Navigation />
          <Main />
          <LoadErrorModal />
          <SyncMismatchModal />
          <SyncNotification />
        </React.Fragment>
      </Transition>
    </React.Fragment>
  );
};

const mapState = (state: ReduxState) => {
  const { sync } = state.user;
  return {
    googleCredentials: sync !== null ? sync.googleCredentials : null,
    syncFrequency: sync !== null ? sync.syncFrequency : 30,
    lockApp: state.navigation.lockApp,
  };
};

const mapDispatch = {
  fetchFolders,
  fetchUserSyncData,
  uploadAppData,
};

export default connect(mapState, mapDispatch)(App);
