import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// actions, selectors
import { getCurrentFolderSelector, getFoldersSelector } from 'selectors/folders';
import { renameFolder } from 'actions/folders';

// components
import AddFolderModal from './AddFolderModal';
import FolderItem from 'pages/Folders/FolderItem';


// types
import { ReduxState } from 'types/redux';

// css
// @ts-ignore
import s from './Folders.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const FoldersList: React.FC<Props> = (props) => {
  const { folders, currentFolder } = props;

  const handleRename = (folderId: string) => (name: string) => {
    props.renameFolder({
      folderId,
      name,
      isCurrentFolder: currentFolder._id === folderId,
    });
  };

  const renderList = () => {
    const list = _.map(folders, (folder) => {
      return (
        <FolderItem
          key={folder._id}
          folder={folder}
          isActive={currentFolder._id === folder._id}
          handleRename={handleRename(folder._id)}
        />
      );
    });

    return (
      <div className={s.folderList}>
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
}

const mapState = (state: ReduxState) => {
  return {
    folders: getFoldersSelector(state),
    currentFolder: getCurrentFolderSelector(state),
  };
}

const mapDispatch = {
  renameFolder,
};

export default connect(mapState, mapDispatch)(FoldersList);
