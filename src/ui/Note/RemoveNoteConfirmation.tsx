import React from 'react';
import { connect } from 'react-redux';
import { removeNote } from 'actions/notes';
import Confirmation from 'ui/Confirmation/Confirmation';
import history from 'utils/history';

type MapDispatch = typeof mapDispatch;
type Props = MapDispatch & {
  noteId: string,
  show: boolean,
  toggle: () => void,
  folderId?: string,
};

const RemoveNoteConfirmation: React.FC<Props> = (props) => {
  const handleRemoveNote = () => {
    props.removeNote(props.noteId);
    props.toggle();

    const { folderId } = props;
    if (folderId) {
      history.push(`/folders/${folderId}`);
    }
  };

  return (
    <Confirmation
      show={props.show}
      toggle={props.toggle}
      message="Are you sure you want to remove the note? This action is permanent."
      confirm={handleRemoveNote}
    />
  );
};

const mapDispatch = {
  removeNote,
};

export default connect(null, mapDispatch)(RemoveNoteConfirmation);
