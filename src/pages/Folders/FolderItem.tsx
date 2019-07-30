import React, { useState } from 'react';
import classNames from 'classnames';

// components
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditableField from 'ui/EditableField/EditableField';
import Confirmation from 'ui/Confirmation/Confirmation';

// types
import { FolderItem as FolderItemType } from 'types/folders';
import Button from 'ui/Button/Button';

import { ContextMenuAction } from 'types/entities';
import s from './Folders.css';


type NotesAction = 'move' | 'delete';

interface Props {
  folder: FolderItemType;
  isActive: boolean;
  handleFolderClick: () => void;
  handleRename: (n: string) => void;
  handleRemoveFolder: (action: NotesAction) => void;
}

const FolderItem: React.FC<Props> = props => {
  const { folder } = props;

  const [folderName, setFolderName] = useState(folder.name);
  const [activateEditMode, setActivateEditMode] = useState(false);
  const [showRemoveConfirmation, setRemoveConfirmation] = useState(false);

  const toggleRemoveConfirmation = () => {
    setRemoveConfirmation(!showRemoveConfirmation);
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFolderName(e.currentTarget.value);
  };

  const handleActivateRename = () => {
    setActivateEditMode(true);
  };

  const resetFolderName = () => {
    setFolderName(folder.name);
    setActivateEditMode(false);
  };

  const handleRemove = (notesAction: NotesAction) => () => {
    toggleRemoveConfirmation();
    props.handleRemoveFolder(notesAction);
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
      execute: toggleRemoveConfirmation,
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
      <div className={s.folder} onClick={props.handleFolderClick}>
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
      <Confirmation
        show={showRemoveConfirmation}
        confirm={handleRemove('delete')}
        toggle={toggleRemoveConfirmation}
        message={`Are you sure you want to remove ${folder.name} folder?`}
      >
        <div className={s.removeConfirmationText}>
          All notes associated with the folder <b>will be removed</b>
          <div className={s.removeConfirmationText}>
            You can choose to&nbsp;
            <Button
              text="move notes to another folder"
              theme="info"
              shape="link"
              onClick={handleRemove('move')}
            />
            &nbsp;instead.
          </div>
        </div>
      </Confirmation>
    </div>
  );
};

export default FolderItem;
