import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Folder from 'pages/Folders/Folder';
import Note from 'pages/Notes/Note';
import { IdRouter } from 'types/router';

const renderCurrentFolder = (props: IdRouter) => {
  return (
    <Folder id={props.match.params.id} />
  );
};

const renderCurrentNote = (props: IdRouter) => {
  return (
    <Note id={props.match.params.id} />
  );
};

const routes = (
  <Switch>
    <Route exact path="/home" />
    <Route exact path="/folders/:id" render={renderCurrentFolder} />
    <Route exact path="/notes/:id" render={renderCurrentNote} />
  </Switch>
);

export default routes;
