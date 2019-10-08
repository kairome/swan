export interface FolderItem {
  name: string,
  _id: string,
  createdAt: Date,
  updatedAt: Date,
  order: number,
}

export interface FolderPayload {
  name: string,
}

export interface RenameFolderPayload {
  folderId: string,
  name: string,
  isCurrentFolder: boolean,
}

export interface CreateFolderPayload {
  name: string,
  order: number,
}
