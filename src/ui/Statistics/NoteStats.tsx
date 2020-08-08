import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { getFolders } from 'selectors/folders';

// types
import { Note } from 'types/notes';

import s from './Statistics.css';


interface Props {
  note: Note,
  className?: string,
}

const NoteStats: React.FC<Props> = (props) => {
  const { note } = props;
  const folders = useSelector(getFolders);

  const renderStatBlock = (title: string, value: string) => {
    if (!value) {
      return null;
    }

    return (
      <div className={s.noteStatBlock}>
        {title} <b>{value}</b>
      </div>
    );
  };

  const renderDates = () => {
    const { createdAt, updatedAt } = note;
    return (
      <div>
        {renderStatBlock('Created', moment(createdAt).format('DD.MM.YY'))}
        {renderStatBlock('Last updated', moment(updatedAt).format('DD.MM.YY, HH:mm'))}
      </div>
    );
  };

  const renderToDoStats = () => {
    const { todoLists } = note;

    const todoItems = _.flatMap(todoLists, list => list.items);
    const completedItems = _.filter(todoItems, item => item.completed);

    return (
      <div className={s.noteStatSection}>
        {renderStatBlock('Todo lists', String(todoLists.length))}
        {renderStatBlock('Todo items', String(todoItems.length))}
        {renderStatBlock('Completed', String(completedItems.length))}
      </div>
    );
  };

  const renderStatus = () => {
    const { isArchived, folder } = note;
    if (!isArchived) {
      return null;
    }
    const noteFolder = _.find(folders, f => f._id === folder);


    return (
      <div className={s.noteStatBlock}>
        <b>Archived</b>, in <b>{noteFolder ? noteFolder.name : 'Unknown'}</b> folder
      </div>
    );
  };

  return (
    <div className={classNames(s.noteStats, props.className)}>
      {renderStatus()}
      {renderToDoStats()}
      {renderDates()}
    </div>
  );
};

export default NoteStats;
