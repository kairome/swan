import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import history from 'utils/history';
import { moveArray } from 'utils/helpers';

// actions, selectors
import { getCurrentFolderSelector, getFoldersSelector } from 'selectors/folders';
import {
  removeFolder,
  renameFolder,
  resetCurrentFolder,
  updateFolders,
} from 'actions/folders';
import { setNotesToMove, toggleMoveNotes } from 'actions/interactive';
import { moveNotesToFolder, removeAllFolderNotes } from 'actions/notes';

// components
import { SortList } from 'ui/Sortable/Sortable';
import AddFolderModal from './AddFolderModal';
import FolderItem from './FolderItem';

// css
import s from './Folders.css';

// types
import { ReduxState } from 'types/redux';
import { DraggableSortArg } from 'types/entities';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const FoldersList: React.FC<Props> = (props) => {
  const { folders, currentFolder } = props;
  const [shouldRemoveFolder, setRemoveFolder] = useState(false);
  const [folderList, setFolderList] = useState(folders);
  useEffect(() => {
    setFolderList(folders);
  }, [folders]);

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

  const handleSort = (arg: DraggableSortArg) => {
    const sorderFolders = moveArray(arg.newIndex, arg.oldIndex, folderList);
    const newFolderList = _.map(sorderFolders, (sf, index) => ({ ...sf, order: index }));
    setFolderList(newFolderList);
    props.updateFolders(newFolderList);
  };

  const renderList = () => {
    const list = _.map(folderList, (folder) => {
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

    const listClasses = classNames(s.foldersList, {
      [s.folderListInteractive]: props.enableMoveNotes,
    });

    return (
      <SortList
        onSortEnd={handleSort}
        items={list}
        className={listClasses}
        disabled={props.enableMoveNotes}
        useDragHandle
      />
    );
  };

  return (
    <div>
      <div className={s.addFolderContainer}>
        <AddFolderModal folderOrder={folderList.length} />
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
  updateFolders,
};

export default connect(mapState, mapDispatch)(FoldersList);
