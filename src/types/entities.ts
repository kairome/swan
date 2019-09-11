import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface DraggableSortArg {
  oldIndex: number,
  newIndex: number,
}

export interface ContextMenuAction {
  title: string | React.ReactNode,
  icon: IconProp,
  execute: () => void,
}

export type SettingsPageId = 'encryption' | 'sync';

export interface DownloadedFile {
  fileName: string,
  fileContent: string,
}

export type DownloadFileResult = DownloadedFile | null;

export interface OptionValue {
  label: string,
  value: string | number,
}
