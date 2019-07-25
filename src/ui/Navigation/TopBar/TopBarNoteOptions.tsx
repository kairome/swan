import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// actions
import { addToDoList, setNoteContentSettings, updateAllLists } from 'actions/notes';

// components
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RemoveNoteConfirmation from 'ui/Confirmation/RemoveNoteConfirmation';

// types
import { ReduxState } from 'types/redux';
import { NoteContentSettings } from 'types/notes';
import { ContextMenuAction } from 'types/entities';

import s from './TopBar.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const TopBarNoteOptions: React.FC<Props> = (props) => {
  const { currentNote } = props;
  if (!currentNote._id) {
    return null;
  }

  const [addedNewList, setAddedNewList] = useState(false);
  const [showRemoveConfirmation, setRemoveConfirmation] = useState(false);

  useEffect(() => {
    if (addedNewList) {
      const newList = document.getElementById(`todo-list-${currentNote.todoLists.length - 1}`);
      if (newList !== null) {
        newList.scrollIntoView({ behavior: 'smooth' });
      }
      setAddedNewList(false);
    }
  }, [currentNote.todoLists.length]);

  const toggleRemoveConfirmation = () => {
    setRemoveConfirmation(!showRemoveConfirmation);
  };

  const handleAddNewList = () => {
    props.addToDoList({
      noteId: currentNote._id,
      list: {
        title: '',
        settings: {
          completedPosition: 'bottom',
          minimized: false,
        },
        items: [],
      },
    });
    setAddedNewList(true);
  };

  const handleToggleLists = (minimize: boolean) => () => {
    const { todoLists } = currentNote;

    const newLists = _.map(todoLists, list => {
      list.settings.minimized = minimize;
      return list;
    });

    props.updateAllLists({
      noteId: currentNote._id,
      lists: newLists,
    })
  };

  const handleContentSettings = (entity: keyof NoteContentSettings) => () => {
    const newSettings = { ...currentNote.contentSettings };
    const current = currentNote.contentSettings[entity];
    newSettings[entity] = !current;
    props.setNoteContentSettings({
      noteId: currentNote._id,
      contentSettings: newSettings,
    });
  };

  const getToggleContentTitle = (title: string, current: boolean) => {
    const actionTitle = current ? 'Show' : 'Hide';

    return `${actionTitle} ${title}`;
  };

  const { contentSettings } = currentNote;

  const options: ContextMenuAction[] = [
    {
      title: 'Minimize all lists',
      icon: 'window-minimize',
      execute: handleToggleLists(true),
    },
    {
      title: 'Maximize all lists',
      icon: 'window-maximize',
      execute: handleToggleLists(false),
    },
    {
      title: getToggleContentTitle('text editor', contentSettings.hideTextEditor),
      icon: 'paragraph',
      execute: handleContentSettings('hideTextEditor'),
    },
    {
      title: getToggleContentTitle('todo lists', contentSettings.hideLists),
      icon: 'clipboard-list',
      execute: handleContentSettings('hideLists'),
    },
  ];

  const actions: ContextMenuAction[] = [
    {
      title: 'Copy',
      icon: 'copy',
      execute: () => {},
    },
    {
      title: 'Move to another folder',
      icon: 'angle-double-right',
      execute: () => {},
    },
    {
      title: 'Lock/unlock',
      icon: 'lock',
      execute: () => {},
    },
    {
      title: 'Protect/unprotect',
      icon: 'eye-slash',
      execute: () => {},
    },
    {
      title: 'Archive/restore',
      icon: 'archive',
      execute: () => {},
    },
    {
      title: 'Remove',
      icon: 'trash',
      execute: toggleRemoveConfirmation,
    },
  ];

  return (
    <div className={s.barOptions}>
      <div onClick={handleAddNewList} className={s.optionsButton}>
        <FontAwesomeIcon icon="clipboard-list" /> New list
      </div>
      <ContextMenu
        actions={options}
        icon={(<div className={s.optionsButton}><FontAwesomeIcon icon="tools" /> Options</div>)}
        menuClassName={s.optionsMenu}
      />
      <ContextMenu
        actions={actions}
        icon={(<div className={s.optionsButton}><FontAwesomeIcon icon="sliders-h" /> Actions</div>)}
        menuClassName={s.optionsMenu}
      />
      <RemoveNoteConfirmation
        noteId={currentNote._id}
        show={showRemoveConfirmation}
        toggle={toggleRemoveConfirmation}
        folderId={currentNote.folder}
      />
    </div>
  );
};

const mapState = (state: ReduxState) => {
  return {
    currentNote: state.notes.current,
  };
}

const mapDispatch = {
  addToDoList,
  updateAllLists,
  setNoteContentSettings,
};

export default connect(mapState, mapDispatch)(TopBarNoteOptions);
