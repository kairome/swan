import React from 'react';
import history from 'utils/history';

// components
import ChangeNoteTitleField from 'ui/Note/ChangeNoteTitleField';
import NoteStats from 'ui/Statistics/NoteStats';
import ContextNoteActions from 'ui/Note/ContextNoteActions';

// types
import { Note } from 'types/notes';

import s from 'pages/Notes/Notes.css';

interface Props {
  note: Note;
}

const NoteItem: React.FC<Props> = props => {
  const { note } = props;

  const handleSetCurrent = () => {
    history.push(`/notes/${note._id}`);
  };

  return (
    <div className={s.note}>
      <ChangeNoteTitleField
        noteTitle={note.title}
        noteId={note._id}
        noteFolder={note.folder}
        className={s.noteListTitle}
        noteArchived={note.isArchived}
      />
      <div className={s.noteStatsListContainer} onClick={handleSetCurrent}>
        <NoteStats note={note} />
      </div>
      <div className={s.noteControls}>
        <ContextNoteActions
          note={note}
          className={s.noteListActionMenu}
          actionIconClassName={s.noteActionIcon}
          inList
        />
      </div>
    </div>
  );
};

export default NoteItem;
