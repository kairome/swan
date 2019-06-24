import React, { useState } from 'react';
import _ from 'lodash';
// types
import { ToDoItem, ToDoListItem } from 'types/notes';
import ToDoList from 'pages/Notes/ToDos/ToDoList';
import { connect } from 'react-redux';
import { ReduxState } from 'types/redux';
import { saveToDoLists } from 'actions/notes';
import Button from 'ui/Button/Button';
import EditableField from 'ui/EditableField/EditableField';
import { FieldType } from 'types/fields';
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

  const [listTitle, setListTitle] = useState('');

  const handleListTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setListTitle(e.currentTarget.value);
  };

  const handleUpdateToDos = (list: ToDoListItem, index: number) => (items: ToDoItem[]) => {
    const { todoLists } = currentNote;
    todoLists[index] = {
      ...list,
      items,
    };
    props.saveToDoLists({ lists: todoLists, id: currentNote._id });
  };

  const handleAddNewList = () => {
    props.saveToDoLists({
      id: currentNote._id,
      lists: [
        ...currentNote.todoLists,
        {
          title: '',
          settings: {
            completedPosition: 'off',
            minimized: false,
          },
          items: [],
        },
      ],
    });
  };

  const renderLists = () => {
    return _.map(currentNote.todoLists, (list, index) => {
      return (
        <div key={`todo-list-${index}`} className={s.listItem}>
          <div>
            <EditableField
              type="text"
              value={listTitle}
              onChange={handleListTitleChange}
              defaultText={list.title ? list.title : 'List title'}
              isEditMode={true}
              save={() => {}}
              reset={() => {}}
              fieldType={FieldType.input}
            />
          </div>
          <div>
            Settings
          </div>
          <ToDoList
            items={list.items}
            save={handleUpdateToDos(list, index)}
          />
        </div>
      );
    });
  };
  return (
    <div>
      <Button text="+ New todo list" theme="info" shape="link"  onClick={handleAddNewList}/>
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
  saveToDoLists,
};

export default connect(mapState, mapDispatch)(ToDoLists);
