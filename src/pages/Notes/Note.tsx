import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchCurrentNote } from 'actions/notes';

// components
import ChangeNoteTitleField from 'ui/Note/ChangeNoteTitleField';
import ToDoLists from 'pages/Notes/ToDos/ToDoLists';
import MarkdownEditor from 'pages/Notes/Markdown/MarkdownEditor';
import NoteStats from 'ui/Statistics/NoteStats';
import Transition from 'ui/Transition/Transition';

// types
import { ReduxState } from 'types/redux';

// css

import s from './Notes.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & {
  id: string,
};

const Note: React.FC<Props> = (props) => {
  useEffect(() => {
    props.fetchCurrentNote(props.id);
  }, [props.id]);

  const { currentNote } = props;

  if (!currentNote._id) {
    return null;
  }

  return (
    <div className={s.noteContainer}>
      <div className={s.noteHeader}>
        <ChangeNoteTitleField
          noteTitle={currentNote.title}
          noteId={currentNote._id}
          className={s.noteTitle}
        />
      </div>
      <NoteStats note={currentNote} className={s.noteStatsContainer} />
      <Transition
        show={!currentNote.contentSettings.hideTextEditor}
        duration={300}
        enter={s.contentActive}
        exit={s.contentDone}
      >
        <MarkdownEditor
          noteId={currentNote._id}
          noteText={currentNote.text}
          noteSettings={currentNote.contentSettings}
        />
      </Transition>
      <Transition
        show={!currentNote.contentSettings.hideLists}
        duration={300}
        enter={s.contentActive}
        exit={s.contentDone}
      >
        <ToDoLists />
      </Transition>
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  currentNote: state.notes.current,
});

const mapDispatch = {
  fetchCurrentNote,
};

export default connect(mapState, mapDispatch)(Note);
