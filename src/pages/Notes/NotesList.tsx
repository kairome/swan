import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import history from 'utils/history';

// actions, selectors
import { removeNote } from 'actions/notes';

// components
import ChangeNoteTitleField from 'ui/Note/ChangeNoteTitleField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Confirmation from 'ui/Confirmation/Confirmation';

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

  const handleRemoveNote = () => {
    if (!currentNoteId) {
      return;
    }

    props.removeNote(currentNoteId);
    setRemoveConfirmation(false);
    setCurrentNoteId('');
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
          <div className={s.noteListDescription} onClick={handleSetCurrent(note._id)}>
            {note.description ? note.description : 'Add description...'}
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
      <Confirmation
        show={showRemoveConfirmation}
        toggle={toggleConfirm}
        message="Are you sure you want to remove the note? This action is permanent."
        confirm={handleRemoveNote}
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
  removeNote,
};

export default connect(mapState, mapDispatch)(NotesList);
