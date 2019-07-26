import React, { useState } from 'react';
import { connect } from 'react-redux';

// components
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import RemoveNoteConfirmation from 'ui/Note/RemoveNoteConfirmation';

// types
import { ContextMenuAction } from 'types/entities';
import { Note } from 'types/notes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addNote } from 'actions/notes';

type MapDispatch = typeof mapDispatch;
type Props = MapDispatch & {
  note: Note,
  menuIcon?: React.ReactNode,
  actionIconClassName?: string,
  inList?: boolean,
  className?: string,
};

const ContextNoteActions: React.FC<Props> = (props) => {
  const { note } = props;
  const [showRemoveConfirmation, setRemoveConfirmation] = useState(false);

  const toggleRemoveConfirmation = () => {
    setRemoveConfirmation(!showRemoveConfirmation);
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
      execute: () => {
      },
    },
    {
      title: 'Lock/unlock',
      icon: 'lock',
      execute: () => {
      },
    },
    {
      title: 'Protect/unprotect',
      icon: 'eye-slash',
      execute: () => {
      },
    },
  ];

  const actions: ContextMenuAction[] = !props.inList ? [
    ...defaultActions,
    {
      title: 'Archive/restore',
      icon: 'archive',
      execute: () => {
      },
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
        <div className={props.actionIconClassName} onClick={() => {
        }}>
          <FontAwesomeIcon icon="archive" />
        </div>
        <div className={props.actionIconClassName} onClick={toggleRemoveConfirmation}>
          <FontAwesomeIcon icon="trash-alt" />
        </div>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {renderListIcons()}
      <ContextMenu
        actions={actions}
        icon={props.menuIcon}
        menuClassName={props.className}
      />
      <RemoveNoteConfirmation
        noteId={note._id}
        show={showRemoveConfirmation}
        toggle={toggleRemoveConfirmation}
        folderId={!props.inList ? note.folder : undefined}
      />
    </React.Fragment>
  );
};

const mapDispatch = {
  addNote,
};

export default connect(null, mapDispatch)(ContextNoteActions);
