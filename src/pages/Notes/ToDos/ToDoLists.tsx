import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

// components
import ToDoList from 'pages/Notes/ToDos/ToDoList';

// types
import { ReduxState } from 'types/redux';
// @ts-ignore
import s from './ToDos.css';

type MapState = ReturnType<typeof mapState>;

type Props = MapState;

const ToDoLists: React.FC<Props> = (props) => {
  const { currentNote } = props;
  if (!currentNote._id) {
    return null;
  }

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
      {renderLists()}
    </div>
  );
};

const mapState = (state: ReduxState) => {
  return {
    currentNote: state.notes.current,
  };
}

export default connect(mapState, null)(ToDoLists);
