import React from 'react';
import { connect } from 'react-redux';
import EditableField from 'ui/EditableField/EditableField';
import { FieldType } from 'types/fields';
import { changeNoteTitle } from 'actions/notes';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  noteTitle: string,
  noteId: string,
  noteFolder?: string,
  className?: string,
}

interface State {
  title: string,
  isEdit: boolean,
}

class ChangeNoteTitleField extends React.Component<Props, State> {
  state = {
    title: this.props.noteTitle,
    isEdit: false,
  };

  setEditMode = () => {
    this.setState({ isEdit: true });
  }

  resetEdit = () => {
    this.setState({ title: this.props.noteTitle, isEdit: false });
  }

  saveNoteTitle = () => {
    const { title, isEdit } = this.state;
    const currentTitle = title.trim();
    if (!currentTitle || !isEdit) {
      return;
    }

    this.props.changeNoteTitle({
      id: this.props.noteId,
      title: currentTitle,
      folderId: this.props.noteFolder,
    });

    setTimeout(() => {
      this.resetEdit()
    }, 200);
  }

  handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState({ title: value });
  }

  render() {
    return (
      <div
        className={this.props.className}
        onClick={this.setEditMode}
      >
        <EditableField
          fieldType={FieldType.input}
          type="text"
          value={this.state.title}
          onChange={this.handleTitleChange}
          defaultText={this.props.noteTitle}
          isEditMode={this.state.isEdit}
          save={this.saveNoteTitle}
          reset={this.resetEdit}
        />
      </div>
    );
  }
}

const mapDispatch = {
  changeNoteTitle,
};

export default connect(null, mapDispatch)(ChangeNoteTitleField);
