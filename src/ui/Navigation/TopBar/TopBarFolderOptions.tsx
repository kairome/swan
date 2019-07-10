import React from 'react';
import { ReduxState } from 'types/redux';
import { addNote } from 'actions/notes';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    const { currentFolder } = props;
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
      <div onClick={handleAddNote} className={s.optionsButton}>
        <FontAwesomeIcon icon="sticky-note" /> New note
      </div>
    </div>
  );
};

const mapState = (state: ReduxState) => {
  return {
    currentFolder: state.folders.current,
  };
}

const mapDispatch = {
  addNote,
};

export default connect(mapState, mapDispatch)(TopBarFolderOptions);
