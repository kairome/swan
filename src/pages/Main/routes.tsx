import React from 'react';
import { Route, Switch } from 'react-router-dom';

// pages
import Folder from 'pages/Folders/Folder';
import Note from 'pages/Notes/Note';
import Archived from 'pages/Archived/Archived';

// types
import { IdMatch } from 'types/router';
import { RouteComponentProps } from 'react-router';

const renderCurrentFolder = (props: RouteComponentProps<IdMatch>) => (
  <Folder id={props.match.params.id} />
);

const renderCurrentNote = (props: RouteComponentProps<IdMatch>) => (
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
