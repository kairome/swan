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
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    setUpdateLoading(false);
  }, [currentNote.todoLists]);

  const handleSort = (arg: DraggableSortArg) => {
    const sortedLists = moveArray(arg.newIndex, arg.oldIndex, currentNote.todoLists);
    setUpdateLoading(true);
    props.updateAllLists({
      noteId: currentNote._id,
      lists: sortedLists,
    });
  }

  const renderLists = () => {
    if (updateLoading) {
      return null;
    }

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

const mapState = (state: ReduxState) => {
  return {
    currentNote: state.notes.current,
  };
}

const mapDispatch = {
  updateAllLists,
};

export default connect(mapState, mapDispatch)(ToDoLists);
