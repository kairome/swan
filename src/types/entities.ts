import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface DraggableSortArg {
  oldIndex: number;
  newIndex: number;
}

export interface ContextMenuAction {
  title: string | React.ReactNode;
  icon: IconProp;
  execute: () => void;
}
