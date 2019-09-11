import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import EditableField from 'ui/EditableField/EditableField';
import { changeNoteTitle } from 'actions/notes';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  noteTitle: string,
  noteId: string,
  noteArchived?: boolean,
  noteFolder?: string,
  className?: string,
};

const ChangeNoteTitleField: React.FC<Props> = (props) => {
  const [noteTitle, setNoteTitle] = useState(props.noteTitle);

  useEffect(() => {
    if (props.noteTitle !== noteTitle) {
      setNoteTitle(props.noteTitle);
    }
  }, [props.noteTitle]);

  const resetEdit = () => {
    setNoteTitle(props.noteTitle);
  };

  const saveNoteTitle = () => {
    const currentTitle = noteTitle.trim();
    if (!currentTitle) {
      return;
    }

    props.changeNoteTitle({
      noteArchived: props.noteArchived,
      id: props.noteId,
      title: currentTitle,
      folderId: props.noteFolder,
    });
  };

  const handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNoteTitle(value);
  };

  return (
    <div
      className={props.className}
    >
      <EditableField
        type="text"
        value={noteTitle}
        onChange={handleTitleChange}
        defaultText={noteTitle}
        save={saveNoteTitle}
        reset={resetEdit}
      />
    </div>
  );
};

const mapDispatch = {
  changeNoteTitle,
};

export default connect(null, mapDispatch)(ChangeNoteTitleField);
