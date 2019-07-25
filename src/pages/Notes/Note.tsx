import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchCurrentNote } from 'actions/notes';

// components
import ChangeNoteTitleField from 'ui/Note/ChangeNoteTitleField';
import ToDoLists from 'pages/Notes/ToDos/ToDoLists';
import MarkdownEditor from 'pages/Notes/Markdown/MarkdownEditor';
import NoteStats from 'ui/Statistics/NoteStats';

// types
import { ReduxState } from 'types/redux';

// css
// @ts-ignore
import s from './Notes.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & {
  id: string,
};

const Note: React.FC<Props> = (props) => {
  useEffect(() => {
    props.fetchCurrentNote(props.id);
  }, []);

  const { currentNote } = props;

  if (!currentNote._id) {
    return null;
  }


  const renderEditor = () => {
    if (currentNote.contentSettings.hideTextEditor) {
      return null;
    }

    return (
      <MarkdownEditor
        noteId={currentNote._id}
        noteText={currentNote.text}
      />
    );
  };

  const renderTodoLists = () => {
    if (currentNote.contentSettings.hideLists) {
      return null;
    }

    return (
      <ToDoLists />
    );
  };

  return (
    <div className={s.noteContainer}>
      <div className={s.noteHeader}>
        <ChangeNoteTitleField
          noteTitle={currentNote.title}
          noteId={currentNote._id}
          className={s.noteTitle}
        />
      </div>
      <div className={s.noteStatsContainer}>
        <NoteStats note={currentNote} />
      </div>
      {renderEditor()}
      {renderTodoLists()}
    </div>
  );
}

const mapState = (state: ReduxState) => {
  return {
    currentNote: state.notes.current,
  };
};

const mapDispatch = {
  fetchCurrentNote,
};

export default connect(mapState, mapDispatch)(Note);
