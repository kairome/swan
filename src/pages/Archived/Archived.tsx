import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// actions
import { fetchNotes, resetCurrentNote } from 'actions/notes';
import { resetCurrentFolder } from 'actions/folders';

// types
import NotesList from 'pages/Notes/NotesList';

type MapDispatch = typeof mapDispatch;
type Props = MapDispatch;

const Archived: React.FC<Props> = (props) => {
  useEffect(() => {
    props.fetchNotes({ isArchived: true });
    props.resetCurrentFolder();
    props.resetCurrentNote();
  }, []);

  return (
    <NotesList isArchived />
  );
};

const mapDispatch = {
  fetchNotes,
  resetCurrentFolder,
  resetCurrentNote,
};

export default connect(null, mapDispatch)(Archived);
