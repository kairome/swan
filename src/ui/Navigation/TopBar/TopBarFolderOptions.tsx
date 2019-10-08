import React from 'react';
import { ReduxState } from 'types/redux';
import { addNote } from 'actions/notes';
import { connect } from 'react-redux';

import Button from 'ui/Button/Button';

import s from './TopBar.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const TopBarFolderOptions: React.FC<Props> = (props) => {
  const { currentFolder } = props;
  if (!currentFolder._id) {
    return null;
  }

  const handleAddNote = () => {
    if (!currentFolder._id) {
      return;
    }

    props.addNote({
      title: 'Untitled',
      folder: currentFolder._id,
    });
  };

  return (
    <div className={s.barOptions}>
      <Button
        text="New note"
        theme="primary"
        shape="text"
        icon="sticky-note"
        onClick={handleAddNote}
      />
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  currentFolder: state.folders.current,
});

const mapDispatch = {
  addNote,
};

export default connect(mapState, mapDispatch)(TopBarFolderOptions);
