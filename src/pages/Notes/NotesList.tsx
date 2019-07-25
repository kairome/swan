import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import history from 'utils/history';

// components
import ChangeNoteTitleField from 'ui/Note/ChangeNoteTitleField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteStats from 'ui/Statistics/NoteStats';
import RemoveNoteConfirmation from 'ui/Confirmation/RemoveNoteConfirmation';

// types
import { ReduxState } from 'types/redux';

// css
// @ts-ignore
import s from './Notes.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const NotesList: React.FC<Props> = (props) => {
  const [showRemoveConfirmation, setRemoveConfirmation] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState('');

  const toggleConfirm = () => {
    setRemoveConfirmation(!showRemoveConfirmation);
  };

  const handleSetCurrent = (id: string) => () => {
    history.push(`/notes/${id}`);
  };

  const handleRemoveConfirmation = (id: string) => () => {
    setCurrentNoteId(id);
    setRemoveConfirmation(true);
  };

  const renderNotes = () => {
    const notes = _.map(props.notes, (note) => {
      return (
        <div
          key={note._id}
          className={s.note}
        >
          <ChangeNoteTitleField
            noteTitle={note.title}
            noteId={note._id}
            noteFolder={note.folder}
            className={s.noteListTitle}
          />
          <div className={s.noteStatsListContainer} onClick={handleSetCurrent(note._id)}>
            <NoteStats note={note} />
          </div>
          <div className={s.noteControls}>
            <div className={s.removeNoteIcon} onClick={handleRemoveConfirmation(note._id)}>
              <FontAwesomeIcon icon="trash-alt" />
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className={s.notes}>
        {notes}
      </div>
    );
  };

  return (
    <div>
      {renderNotes()}
      <RemoveNoteConfirmation
        noteId={currentNoteId}
        show={showRemoveConfirmation}
        toggle={toggleConfirm}
      />
    </div>
  );
}

const mapState = (state: ReduxState) => {
  return {
    currentFolder: state.folders.current,
    notes: state.notes.list,
  };
}

const mapDispatch = {
};

export default connect(mapState, mapDispatch)(NotesList);
