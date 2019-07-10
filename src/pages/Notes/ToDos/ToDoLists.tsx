import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

// actions
import { addToDoList } from 'actions/notes';

// components
import Button from 'ui/Button/Button';
import ToDoList from 'pages/Notes/ToDos/ToDoList';

// types
import { ReduxState } from 'types/redux';
// @ts-ignore
import s from './ToDos.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;

type Props = MapState & MapDispatch;

const ToDoLists: React.FC<Props> = (props) => {
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

  const renderLists = () => {
    const listItems = _.map(currentNote.todoLists, (list, index) => {
      const key = `todo-list-${index}`;
      return (
        <ToDoList
          key={key}
          listItem={list}
          listKey={key}
          listIndex={index}
          noteId={currentNote._id}
        />
      );
    });

    return (
      <div className={s.listsContainer}>
        {listItems}
      </div>
    );
  };
  return (
    <div>
      <Button text="+ New todo list" theme="info" shape="link" onClick={handleAddNewList} />
      {renderLists()}
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
};

export default connect(mapState, mapDispatch)(ToDoLists);
