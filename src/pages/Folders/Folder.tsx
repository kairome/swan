import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// actions, selectors
import { getCurrentFolderSelector } from 'selectors/folders';
import { fetchCurrentFolder } from 'actions/folders';

// components
import NotesList from 'pages/Notes/NotesList';

// types
import { ReduxState } from 'types/redux';
import { resetCurrentNote } from 'actions/notes';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & {
  id: string;
};

const Folder: React.FC<Props> = props => {
  useEffect(() => {
    props.resetCurrentNote();
    props.fetchCurrentFolder(props.id);
  }, [props.id]);

  const { currentFolder } = props;
  if (!currentFolder._id) {
    return null;
  }

  return (
    <NotesList />
  );
};

const mapState = (state: ReduxState) => ({
  currentFolder: getCurrentFolderSelector(state),
});

const mapDispatch = {
  fetchCurrentFolder,
  resetCurrentNote,
};

export default connect(mapState, mapDispatch)(Folder);
