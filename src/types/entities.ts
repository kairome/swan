import { IconName } from '@fortawesome/fontawesome-svg-core';

export interface DraggableSortArg {
  oldIndex: number,
  newIndex: number,
}

export interface ContextMenuAction {
  title: string,
  icon: IconName,
  execute: () => void,
}

export type SettingsPageId = 'security' | 'sync' | 'customization';

export interface DownloadedFile {
  fileName: string,
  fileContent: string,
}

export type DownloadFileResult = DownloadedFile | null;

export interface OptionValue {
  label: string,
  value: string | number,
}

export type LoaderName = 'notes' | 'currentFolder' | 'sync';

export type LoaderPayload = {
  [k in LoaderName]?: boolean
};
