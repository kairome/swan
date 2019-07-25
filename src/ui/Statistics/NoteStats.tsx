import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import { Note } from 'types/notes';

interface Props {
  note: Note,
}

const NoteStats: React.FC<Props> = (props) => {
  const { note } = props;

  const renderDates = () => {
    const { createdAt, updatedAt } = note;
    return (
      <React.Fragment>
        <div>Created on <b>{moment(createdAt).format('DD.MM.YYYY')}</b></div>
        <div>Last updated on <b>{moment(updatedAt).format('DD.MM.YYYY, HH:mm')}</b></div>
      </React.Fragment>
    );
  };

  const getPlural = (word: string, length: number) => {
    if (length > 1 || length === 0) {
      return `${word}s`;
    }

    return word;
  };

  const renderToDoStats = () => {
    const { todoLists } = note;

    const todoItems = _.flatMap(todoLists, list => list.items);
    const completedItems = _.filter(todoItems, item => item.completed);

    const todoLength = todoLists.length;
    const itemsLength = todoItems.length;
    const completedLength = completedItems.length;
    const verb = completedLength === 1 ? 'is' : 'are';
    return (
      <React.Fragment>
        <div><b>{todoLength}</b> todo {getPlural('list', todoLength)}</div>
        <div><b>{itemsLength}</b> total todo {getPlural('item', todoItems.length)}</div>
        <div><b>{completedLength}</b> of which {verb} completed</div>
      </React.Fragment>
    );
  };

  return (
    <div>
      {renderDates()}
      {renderToDoStats()}
    </div>
  );
};

export default NoteStats;
