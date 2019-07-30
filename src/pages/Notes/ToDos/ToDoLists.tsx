import React from 'react';
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

  const handleSort = (arg: DraggableSortArg) => {
    const sortedLists = moveArray(arg.newIndex, arg.oldIndex, currentNote.todoLists);
    props.updateAllLists({
      noteId: currentNote._id,
      lists: sortedLists,
    });
  }

  const renderLists = () => {
    const listItems = _.map(currentNote.todoLists, (list) => {
      return (
        <ToDoList
          key={`todo-list-${list.id}`}
          listItem={list}
          noteId={currentNote._id}
          totalLists={currentNote.todoLists.length}
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
