import React, { useState } from 'react';
import classNames from 'classnames';
import history from 'utils/history';

// components
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditableField from 'ui/EditableField/EditableField';

// types
import { FolderItem as FolderItemType } from 'types/folders';
import { ContextMenuAction } from 'types/entities';

import s from 'pages/Folders/Folders.css';

interface Props {
  folder: FolderItemType,
  isActive: boolean,
  handleRename: (n: string) => void,
}

const FolderItem: React.FC<Props> = (props) => {
  const { folder } = props;

  const [folderName, setFolderName] = useState(folder.name);
  const [activateEditMode, setActivateEditMode] = useState(false);

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFolderName(e.currentTarget.value);
  };

  const handleActivateRename = () => {
    setActivateEditMode(true);
  };

  const handleFolderClick = (id: string) => () => {
    history.push(`/folders/${id}`);
  };

  const resetFolderName = () => {
    setFolderName(folder.name);
    setActivateEditMode(false);
  };

  const saveFolderName = () => {
    if (!folderName.trim()) {
      resetFolderName();
      return;
    }

    props.handleRename(folderName);
    setActivateEditMode(false);
  };

  const menuActions: ContextMenuAction[] = [
    {
      title: 'Rename',
      icon: 'file-signature',
      execute: handleActivateRename,
    },
    {
      title: 'Remove',
      icon: 'trash',
      execute: () => {
      },
    },
  ];

  const folderClasses = classNames(s.folderItem, {
    [s.active]: props.isActive,
  });
  return (
    <div className={folderClasses}>
      <ContextMenu
        actions={menuActions}
        menuClassName={s.folderMenu}
        menuIconClassName={s.folderMenuIcon}
      />
      <div className={s.folder} onClick={handleFolderClick(folder._id)}>
        <FontAwesomeIcon icon="folder" className={s.folderIcon} />
        <EditableField
          type="text"
          value={folderName}
          onChange={handleNameChange}
          defaultText={folder.name}
          save={saveFolderName}
          reset={resetFolderName}
          activateEditMode={activateEditMode}
          autoFocus
        />
      </div>
    </div>
  );
};

export default FolderItem;
