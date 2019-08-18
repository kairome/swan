import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { generateId } from 'utils/helpers';

// actions
import { addToDoList, setNoteContentSettings, updateAllLists } from 'actions/notes';

// components
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContextNoteActions from 'ui/Note/ContextNoteActions';

// types
import { ReduxState } from 'types/redux';
import { NoteContentSettings } from 'types/notes';
import { ContextMenuAction } from 'types/entities';

import s from './TopBar.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const TopBarNoteOptions: React.FC<Props> = props => {
  const { currentNote } = props;
  if (!currentNote._id) {
    return null;
  }

  const handleAddNewList = () => {
    const newListId = generateId();
    props.addToDoList({
      noteId: currentNote._id,
      list: {
        id: newListId,
        title: '',
        settings: {
          completedPosition: 'bottom',
          minimized: false,
        },
        items: [],
      },
    });
  };

  const handleToggleLists = (minimize: boolean) => () => {
    const { todoLists } = currentNote;

    const newLists = _.map(todoLists, list => ({
      ...list,
      settings: {
        ...list.settings,
        minimized: minimize,
      },
    }));

    props.updateAllLists({
      noteId: currentNote._id,
      lists: newLists,
    });
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


  return (
    <div className={s.barOptions}>
      <div onClick={handleAddNewList} className={s.optionsButton}>
        <FontAwesomeIcon icon="clipboard-list" /> New list
      </div>
      <ContextMenu
        actions={options}
        icon={(
          <div className={s.optionsButton}>
            <FontAwesomeIcon icon="tools" /> Options
          </div>
        )}
        menuClassName={s.optionsMenu}
      />
      <ContextNoteActions
        note={currentNote}
        menuIcon={(
          <div className={s.optionsButton}>
            <FontAwesomeIcon icon="sliders-h" /> Actions
          </div>
        )}
        className={s.optionsMenu}
      />
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  currentNote: state.notes.current,
});

const mapDispatch = {
  addToDoList,
  updateAllLists,
  setNoteContentSettings,
};

export default connect(mapState, mapDispatch)(TopBarNoteOptions);
