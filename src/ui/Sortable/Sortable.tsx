import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

type SortListProps = SortableContainerProps & {
  items: React.ReactNode[],
};

type SortListItemProps = SortableElementProps & {
  value: React.ReactNode,
};

export const SortHandle = SortableHandle((props: { className?: string, }) => (
  <div className={props.className}><FontAwesomeIcon icon="grip-horizontal" /></div>
));

export const SortItem = SortableElement((props: SortListItemProps) => <div>{props.value}</div>);

export const SortList = SortableContainer((props: SortListProps) => (
  <div>
    {_.map(props.items, (item, i: number) => <SortItem value={item} key={`sort-todo-${i}`} index={i} />)}
  </div>
));
