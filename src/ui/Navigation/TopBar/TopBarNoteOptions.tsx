import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// actions
import { addToDoList, setNoteContentSettings, updateAllLists } from 'actions/notes';

// components
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// types
import { ReduxState } from 'types/redux';
import { NoteContentSettings } from 'types/notes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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

  useEffect(() => {
    if (addedNewList) {
      const newList = document.getElementById(`todo-list-${currentNote.todoLists.length - 1}`);
      if (newList !== null) {
        newList.scrollIntoView({ behavior: 'smooth' });
      }
      setAddedNewList(false);
    }
  }, [currentNote.todoLists.length]);

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

  const getToggleListsTitle = (type: 'min' | 'max') => {
    const title = type === 'min' ? 'Minimize' : 'Maximize'
    const icon = type === 'min' ? 'window-minimize' : 'window-maximize';
    return (
      <React.Fragment>
        <FontAwesomeIcon icon={icon} /> {title} all lists
      </React.Fragment>
    );
  };

  const getToggleContentTitle = (title: string, icon: IconProp, current: boolean) => {
    const actionTitle = current ? 'Show' : 'Hide';

    return (
      <React.Fragment>
        <FontAwesomeIcon icon={icon} /> {actionTitle} {title}
      </React.Fragment>
    );
  };

  const { contentSettings } = currentNote;

  const options = [
    {
      title: getToggleListsTitle('min'),
      execute: handleToggleLists(true),
    },
    {
      title: getToggleListsTitle('max'),
      execute: handleToggleLists(false),
    },
    {
      title: getToggleContentTitle('text editor', 'paragraph', contentSettings.hideTextEditor),
      execute: handleContentSettings('hideTextEditor'),
    },
    {
      title: getToggleContentTitle('todo lists', 'clipboard-list', contentSettings.hideLists),
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
        icon={(<div className={s.optionsButton}><FontAwesomeIcon icon="sliders-h" /> Options</div>)}
        menuClassName={s.optionsMenu}
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
