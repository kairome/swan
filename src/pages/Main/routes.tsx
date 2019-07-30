import React from 'react';
import { Route, Switch } from 'react-router-dom';

// pages
import Folder from 'pages/Folders/Folder';
import Note from 'pages/Notes/Note';
import Archived from 'pages/Archived/Archived';

// types
import { IdRouter } from 'types/router';

const renderCurrentFolder = (props: IdRouter) => (
  <Folder id={props.match.params.id} />
);

const renderCurrentNote = (props: IdRouter) => (
  <Note id={props.match.params.id} />
);

const routes = (
  <Switch>
    <Route exact path="/home" />
    <Route exact path="/folders/:id" render={renderCurrentFolder} />
    <Route exact path="/notes/:id" render={renderCurrentNote} />
    <Route exact path="/archived" component={Archived} />
  </Switch>
);

export default routes;
