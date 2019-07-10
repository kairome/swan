import React, { useEffect, useState } from 'react';
import { ReduxState } from 'types/redux';
import { addToDoList, updateAllLists } from 'actions/notes';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import ContextMenu from 'ui/ContextMenu/ContextMenu';

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

  const getToggleIcons = (type: 'min' | 'max') => {
    const title = type === 'min' ? 'Minimize' : 'Maximize'
    const icon = type === 'min' ? 'window-minimize' : 'window-maximize';
    return (
      <React.Fragment>
        <FontAwesomeIcon icon={icon} /> {title} all lists
      </React.Fragment>
    );
  };

  const options = [
    {
      title: getToggleIcons('min'),
      execute: handleToggleLists(true),
    },
    {
      title: getToggleIcons('max'),
      execute: handleToggleLists(false),
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
};

export default connect(mapState, mapDispatch)(TopBarNoteOptions);
