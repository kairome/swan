import React, { useState } from 'react';
import { connect } from 'react-redux';

// actions
import { addNote, changeNoteArchiveStatus, removeNote } from 'actions/notes';
import { setNotesToMove } from 'actions/interactive';

// components
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import Confirmation from 'ui/Confirmation/Confirmation';

// types
import { ContextMenuAction } from 'types/entities';
import { Note } from 'types/notes';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import Button from 'ui/Button/Button';

type MapDispatch = typeof mapDispatch;
type Props = MapDispatch & {
  note: Note,
  menuText?: string,
  menuIcon?: IconName,
  inList?: boolean,
  className?: string,
};

const ContextNoteActions: React.FC<Props> = (props) => {
  const { note } = props;
  const { isArchived } = note;
  const [showRemoveConfirmation, setRemoveConfirmation] = useState(false);

  const toggleRemoveConfirmation = () => {
    setRemoveConfirmation(!showRemoveConfirmation);
  };

  const handleRemoveNote = () => {
    props.removeNote({
      noteId: note._id,
      folderId: note.folder,
      isArchived,
      inList: props.inList,
    });
    toggleRemoveConfirmation();
  };

  const handleArchiveStatus = () => {
    props.changeNoteArchiveStatus({
      noteId: note._id,
      folderId: note.folder,
      isArchived: !isArchived,
      inList: props.inList,
    });
  };

  const handleMove = () => {
    props.setNotesToMove({
      noteIds: [note._id],
      moveFrom: note.folder,
    });
  };

  const handleCopyNote = () => {
    const copy = { ...note };
    delete copy._id;
    delete copy.createdAt;
    delete copy.updatedAt;
    copy.title = `${note.title} (Copy)`;
    props.addNote({
      copy,
      folder: copy.folder,
      title: copy.title,
    });
  };

  const defaultActions: ContextMenuAction[] = [
    {
      title: 'Copy',
      icon: 'copy',
      execute: handleCopyNote,
    },
    {
      title: 'Move to another folder',
      icon: 'exchange-alt',
      execute: handleMove,
    },
    // {
    //   title: 'Lock/unlock',
    //   icon: 'lock',
    //   execute: () => {
    //   },
    // },
    // {
    //   title: 'Protect/unprotect',
    //   icon: 'eye-slash',
    //   execute: () => {
    //   },
    // },
  ];

  const actions: ContextMenuAction[] = !props.inList ? [
    ...defaultActions,
    {
      title: isArchived ? 'Restore' : 'Archive',
      icon: isArchived ? 'trash-restore' : 'archive',
      execute: handleArchiveStatus,
    },
    {
      title: 'Remove',
      icon: 'trash',
      execute: toggleRemoveConfirmation,
    },
  ] : defaultActions;

  const renderListIcons = () => {
    if (!props.inList) {
      return null;
    }

    return (
      <React.Fragment>
        <Button
          text=""
          theme="info"
          shape="icon"
          icon={isArchived ? 'trash-restore' : 'archive'}
          onClick={handleArchiveStatus}
        />
        <Button
          text=""
          theme="info"
          shape="icon"
          icon="trash"
          onClick={toggleRemoveConfirmation}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {renderListIcons()}
      <ContextMenu
        id="noteActions"
        actions={actions}
        icon={props.menuIcon}
        menuText={props.menuText}
        menuClassName={props.className}
      />
      <Confirmation
        show={showRemoveConfirmation}
        toggle={toggleRemoveConfirmation}
        message="Are you sure you want to remove the note? This action is permanent."
        confirm={handleRemoveNote}
      />
    </React.Fragment>
  );
};

const mapDispatch = {
  addNote,
  changeNoteArchiveStatus,
  removeNote,
  setNotesToMove,
};

export default connect(null, mapDispatch)(ContextNoteActions);
