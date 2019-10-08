import React from 'react';
import _ from 'lodash';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';

type SortListProps = SortableContainerProps & {
  items: React.ReactNode[],
  className?: string,
  disabled?: boolean,
};

type SortListItemProps = SortableElementProps & {
  value: React.ReactNode,
};

export const SortHandle = SortableHandle((props: { className?: string, icon?: IconName, }) => {
  const { icon = 'grip-horizontal' } = props;
  return (
    <div className={props.className}><FontAwesomeIcon icon={icon} /></div>
  );
});

export const SortItem = SortableElement((props: SortListItemProps) => <div>{props.value}</div>);

export const SortList = SortableContainer((props: SortListProps) => (
  <div className={props.className}>
    {_.map(props.items, (item, i: number) =>
      <SortItem value={item} key={`sort-todo-${i}`} index={i} disabled={props.disabled} />)
    }
  </div>
));
