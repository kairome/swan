import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import history from 'utils/history';

// actions, selectors
import { getCurrentFolderSelector, getFoldersSelector } from 'selectors/folders';
import { removeFolder, renameFolder, resetCurrentFolder } from 'actions/folders';
import { setNotesToMove, toggleMoveNotes } from 'actions/interactive';
import { moveNotesToFolder, removeAllFolderNotes } from 'actions/notes';

// components
import { ReduxState } from 'types/redux';
import AddFolderModal from './AddFolderModal';
import FolderItem from './FolderItem';

// types

// css
import s from './Folders.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const FoldersList: React.FC<Props> = props => {
  const { folders, currentFolder } = props;
  const [shouldRemoveFolder, setRemoveFolder] = useState(false);

  const handleRename = (folderId: string) => (name: string) => {
    props.renameFolder({
      folderId,
      name,
      isCurrentFolder: currentFolder._id === folderId,
    });
  };

  const handleFolderClick = (folderId: string) => () => {
    if (props.enableMoveNotes) {
      const { moveNoteFrom } = props;
      if (moveNoteFrom === folderId) {
        return;
      }

      if (!moveNoteFrom) {
        props.toggleMoveNotes();
        return;
      }

      props.moveNotesToFolder({
        moveFrom: moveNoteFrom,
        moveTo: folderId,
        noteIds: props.notesToMove,
      });

      if (shouldRemoveFolder) {
        props.removeFolder(moveNoteFrom);
        setRemoveFolder(false);
      }
      return;
    }

    history.push(`/folders/${folderId}`);
  };

  const handleRemoveFolder = (folderId: string) => (notesAction: 'move' | 'delete') => {
    if (notesAction === 'move') {
      setRemoveFolder(true);
      props.setNotesToMove({
        noteIds: [],
        moveFrom: folderId,
      });
    }

    if (notesAction === 'delete') {
      props.removeFolder(folderId);
      props.removeAllFolderNotes(folderId);
      if (folderId === currentFolder._id) {
        history.push('/home');
        props.resetCurrentFolder();
      }
    }
  };

  const renderList = () => {
    const list = _.map(folders, folder => {
      const { _id } = folder;
      return (
        <FolderItem
          key={_id}
          folder={folder}
          isActive={currentFolder._id === _id}
          handleRename={handleRename(_id)}
          handleRemoveFolder={handleRemoveFolder(_id)}
          handleFolderClick={handleFolderClick(_id)}
        />
      );
    });

    const listClasses = classNames(s.folderList, {
      [s.folderListInteractive]: props.enableMoveNotes,
    });

    return (
      <div className={listClasses}>
        {list}
      </div>
    );
  };

  return (
    <div>
      <div className={s.addFolderContainer}>
        <AddFolderModal />
      </div>
      {renderList()}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  folders: getFoldersSelector(state),
  currentFolder: getCurrentFolderSelector(state),
  enableMoveNotes: state.interactive.enableMoveNotes,
  moveNoteFrom: state.interactive.moveFrom,
  notesToMove: state.interactive.notesToMove,
});

const mapDispatch = {
  renameFolder,
  toggleMoveNotes,
  removeFolder,
  moveNotesToFolder,
  setNotesToMove,
  removeAllFolderNotes,
  resetCurrentFolder,
};

export default connect(mapState, mapDispatch)(FoldersList);
