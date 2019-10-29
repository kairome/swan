import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import { generateId } from 'utils/helpers';

// actions
import {
  addToDoList,
  deleteToDoList,
  updateListSettings,
  updateToDoListItems,
  updateToDoListTitle,
} from 'actions/notes';

// components
import EditableField from 'ui/EditableField/EditableField';
import ListSettings from 'pages/Notes/ToDos/ListSettings';
import ToDoItems from 'pages/Notes/ToDos/ToDoItems';
import { SortHandle } from 'ui/Sortable/Sortable';
import Confirmation from 'ui/Confirmation/Confirmation';
import Button from 'ui/Button/Button';

// types
import { ToDoItem, ToDoListItem } from 'types/notes';

// css
import s from 'pages/Notes/ToDos/ToDos.css';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  listItem: ToDoListItem,
  noteId: string,
  totalLists: number,
};

const ToDoList: React.FC<Props> = (props) => {
  const { listItem, noteId } = props;
  const [listTitle, setListTitle] = useState(listItem.title ? listItem.title : 'New list');
  const [showRemoveListConfirmation, setRemoveListConfirmation] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (listItem.title !== listTitle && listItem.title) {
      setListTitle(listItem.title);
    }
  }, [listItem.title]);

  const handleListTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setListTitle(e.currentTarget.value);
  };

  const toggleRemoveListConfirmation = () => {
    setRemoveListConfirmation(!showRemoveListConfirmation);
  };

  const handleUpdateToDos = (items: ToDoItem[]) => {
    props.updateToDoListItems({
      noteId,
      items,
      listId: listItem.id,
    });
  };

  const resetListTitle = () => {
    setListTitle(listItem.title ? listItem.title : 'New list');
  };

  const handleSaveListTitle = () => {
    const title = listTitle.trim();
    if (!title) {
      resetListTitle();
      return;
    }

    props.updateToDoListTitle({
      noteId,
      listId: listItem.id,
      title,
    });
  };

  const handleRemoveList = () => {
    setRemoveListConfirmation(false);
    setVisible(false);
    setTimeout(() => {
      props.deleteToDoList({
        noteId,
        listId: listItem.id,
      });
    }, 250);
  };

  const listBodyClasses = classNames(s.listBody, {
    [s.listMinimized]: listItem.settings.minimized,
  });

  const handleMinimize = () => {
    props.updateListSettings({
      noteId,
      listId: listItem.id,
      settings: {
        ...listItem.settings,
        minimized: !listItem.settings.minimized,
      },
    });
  };

  const handleCopy = () => {
    const copyListId = generateId();
    props.addToDoList({
      noteId,
      list: {
        ...listItem,
        id: copyListId,
        title: `${listItem.title} (Copy)`,
      },
    });
  };

  const icon = listItem.settings.minimized ? 'chevron-up' : 'chevron-down';
  const checked = _.filter(listItem.items, i => i.completed).length;

  const listClasses = classNames(s.listItem, {
    [s.listExit]: !visible,
  });

  return (
    <React.Fragment>
      <div className={listClasses} id={listItem.id} key={listItem.id}>
        <div className={s.listHeader}>
          <SortHandle className={s.listHandle} />
          <Button
            text=""
            theme="info"
            shape="icon"
            onClick={toggleRemoveListConfirmation}
            icon="trash"
            size="m"
            className={s.removeList}
          />
          <EditableField
            type="text"
            value={listTitle}
            onChange={handleListTitleChange}
            textClassName={s.listTitle}
            className={s.listTitle}
            save={handleSaveListTitle}
            reset={resetListTitle}
          />
          <Button
            text=""
            theme="info"
            shape="icon"
            onClick={handleMinimize}
            icon={icon}
            size="lg"
            className={s.chevron}
          />
        </div>
        <div className={listBodyClasses}>
          <div className={s.listStat}>
            <span className={s.listStatNumber}>{checked}</span>
            &nbsp;out of <span className={s.listStatNumber}>{listItem.items.length}</span>
            &nbsp;items completed
          </div>
          <ListSettings
            listId={listItem.id}
            noteId={noteId}
            settings={listItem.settings}
            handleCreateCopy={handleCopy}
          />
          <ToDoItems
            listId={listItem.id}
            completedPosition={listItem.settings.completedPosition}
            items={listItem.items}
            save={handleUpdateToDos}
          />
        </div>
      </div>
      <Confirmation
        show={showRemoveListConfirmation}
        toggle={toggleRemoveListConfirmation}
        message="Are you sure you want to remove the list? This action is permanent."
        confirm={handleRemoveList}
      />
    </React.Fragment>
  );
};

const mapDispatch = {
  updateToDoListItems,
  deleteToDoList,
  updateListSettings,
  addToDoList,
  updateToDoListTitle,
};

export default connect(null, mapDispatch)(ToDoList);
