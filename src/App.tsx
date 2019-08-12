import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

// components
import Navigation from 'ui/Navigation/Navigation';
import Main from 'pages/Main/Main';
import Auth from 'pages/Auth/Auth';
import { connect } from 'react-redux';
import { fetchFolders } from 'actions/folders';

type MapDispatch = typeof mapDispatch;
const App: React.FC<MapDispatch> = props => {
  const [showAuth, setShowAuth] = useState(ipcRenderer.sendSync('get-auth-status'));

  if (!showAuth) {
    ipcRenderer.send('init');
  }

  ipcRenderer.on('load-app', () => {
    setShowAuth(false);
  });

  useEffect(() => {
    if (!showAuth) {
      props.fetchFolders();
    }
  }, [showAuth]);

  if (showAuth) {
    return (
      <Auth />
    );
  }

  return (
    <React.Fragment>
      <Navigation />
      <Main />
    </React.Fragment>
  );
};

const mapDispatch = {
  fetchFolders,
};

export default connect(null, mapDispatch)(App);
