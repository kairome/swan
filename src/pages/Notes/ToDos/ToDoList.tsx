import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';

// actions
import { addToDoList, deleteToDoList, updateListSettings, updateToDoList } from 'actions/notes';

// components
import EditableField from 'ui/EditableField/EditableField';
import ListSettings from 'pages/Notes/ToDos/ListSettings';
import ToDoItems from 'pages/Notes/ToDos/ToDoItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SortHandle } from 'ui/Sortable/Sortable';
import Confirmation from 'ui/Confirmation/Confirmation';

// types
import { ToDoItem, ToDoListItem } from 'types/notes';

// css
import s from 'pages/Notes/ToDos/ToDos.css';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  listItem: ToDoListItem,
  listKey: string,
  listIndex: number,
  noteId: string,
}

const ToDoList: React.FC<Props> = (props) => {
  const { listKey, listIndex, listItem, noteId } = props;
  const [listTitle, setListTitle] = useState(listItem.title);
  const [showRemoveListConfirmation, setRemoveListConfirmation] = useState(false);
  const [showListSettings, toggleListSettings] = useState(false);

  useEffect(() => {
    if (listItem.title !== listTitle) {
      setListTitle(listItem.title);
    }
  }, [listItem.title])

  const handleListTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setListTitle(e.currentTarget.value);
  };

  const toggleRemoveListConfirmation = () => {
    setRemoveListConfirmation(!showRemoveListConfirmation);
  };

  const handleUpdateToDos = (items: ToDoItem[]) => {
    props.updateToDoList({
      noteId,
      listIndex,
      list: {
        ...listItem,
        items,
      },
    });
  };

  const resetListTitle = () => {
    setListTitle(listItem.title);
  };

  const handleSaveListTitle = () => {
    const title = listTitle.trim();
    if (!title) {
      return;
    }

    props.updateToDoList({
      noteId,
      listIndex,
      list: {
        ...listItem,
        title,
      },
    });
  }

  const handleRemoveList = () => {
    setRemoveListConfirmation(false);
    props.deleteToDoList({
      noteId,
      listIndex,
    });
  };

  const listBodyClasses = classNames(s.listBody, {
    [s.listMinimized]: listItem.settings.minimized,
  });

  const handleMinimize = () => {
    props.updateListSettings({
      noteId,
      listIndex,
      settings: {
        ...listItem.settings,
        minimized: !listItem.settings.minimized,
      },
    });
  };

  const handleListSettings = () => {
    toggleListSettings(!showListSettings);
  };

  const handleCopy = () => {
    props.addToDoList({
      noteId,
      list: {
        ...listItem,
        title: `${listItem.title} (Copy)`
      },
    })
  };

  const renderSettings = () => {
    if (showListSettings) {
      return (
        <React.Fragment>
          <div className={s.listSettingsButton} onClick={handleListSettings}>Hide list settings</div>
          <ListSettings
            listKey={listKey}
            listIndex={listIndex}
            noteId={noteId}
            settings={listItem.settings}
            handleCreateCopy={handleCopy}
          />
        </React.Fragment>
      );
    }

    return (
      <div className={s.listSettingsShowButton} onClick={handleListSettings}>List settings</div>
    );
  };

  const icon = listItem.settings.minimized ? 'chevron-up' : 'chevron-down';
  const checked = _.filter(listItem.items, i => i.completed).length;

  return (
    <div className={s.listItem} id={listKey}>
      <div className={s.listHeader}>
        <SortHandle className={s.listHandle} />
        <div className={s.removeList} onClick={toggleRemoveListConfirmation}>
          <FontAwesomeIcon icon="trash-alt" />
        </div>
        <EditableField
          type="text"
          value={listTitle}
          onChange={handleListTitleChange}
          defaultText={listItem.title ? listItem.title : 'New list'}
          textClassName={s.listTitle}
          className={s.listTitle}
          save={handleSaveListTitle}
          reset={resetListTitle}
        />
        <div className={s.chevron} onClick={handleMinimize}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
      <div className={listBodyClasses}>
        <div className={s.listStat}>
          <span className={s.listStatNumber}>{checked}</span>
          &nbsp;out of <span className={s.listStatNumber}>{listItem.items.length}</span> items completed
        </div>
        {renderSettings()}
        <ToDoItems
          listKey={listKey}
          completedPosition={listItem.settings.completedPosition}
          items={listItem.items}
          save={handleUpdateToDos}
        />
      </div>
      <Confirmation
        show={showRemoveListConfirmation}
        toggle={toggleRemoveListConfirmation}
        message="Are you sure you want to remove the list? This action is permanent."
        confirm={handleRemoveList}
      />
    </div>
  );
};

const mapDispatch = {
  updateToDoList,
  deleteToDoList,
  updateListSettings,
  addToDoList,
};

export default connect(null, mapDispatch)(ToDoList);
