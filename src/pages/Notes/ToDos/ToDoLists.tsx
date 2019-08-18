import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { moveArray } from 'utils/helpers';

// actions
import { updateAllLists } from 'actions/notes';

// components
import ToDoList from 'pages/Notes/ToDos/ToDoList';
import { SortList } from 'ui/Sortable/Sortable';

// types
import { ReduxState } from 'types/redux';
import { DraggableSortArg } from 'types/entities';

// css
import s from './ToDos.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const ToDoLists: React.FC<Props> = props => {
  const { currentNote } = props;
  if (!currentNote._id) {
    return null;
  }

  const [lists, setLists] = useState(currentNote.todoLists);
  const [elemsLen] = useState(currentNote.todoLists.length);

  useEffect(() => {
    if (!_.isEqual(currentNote.todoLists, lists)) {
      setLists(currentNote.todoLists);
    }
  }, [currentNote.todoLists])

  useEffect(() => {
    if (elemsLen < lists.length) {
      const newList = document.getElementById(currentNote.todoLists[lists.length - 1].id);
      if (newList !== null) {
        newList.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [lists.length]);

  const handleSort = (arg: DraggableSortArg) => {
    const sortedLists = moveArray(arg.newIndex, arg.oldIndex, currentNote.todoLists);
    setLists(sortedLists);
    props.updateAllLists({
      noteId: currentNote._id,
      lists: sortedLists,
    });
  };

  const renderLists = () => {
    const listItems = _.map(lists, list => (
      <ToDoList
        key={`todo-list-${list.id}`}
        listItem={list}
        noteId={currentNote._id}
        totalLists={lists.length}
      />
    ));

    return (
      <div className={s.listsContainer}>
        <SortList
          items={listItems}
          onSortEnd={handleSort}
          useDragHandle
        />
      </div>
    );
  };
  return (
    <div>
      {renderLists()}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  currentNote: state.notes.current,
});

const mapDispatch = {
  updateAllLists,
};

export default connect(mapState, mapDispatch)(ToDoLists);
