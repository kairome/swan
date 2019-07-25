import React from 'react';
import { connect } from 'react-redux';

import { changeNoteDescription, fetchCurrentNote } from 'actions/notes';

// components
import ChangeNoteTitleField from 'ui/Note/ChangeNoteTitleField';
import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';
import ToDoLists from 'pages/Notes/ToDos/ToDoLists';
import MarkdownEditor from 'pages/Notes/Markdown/MarkdownEditor';

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

interface State {
  noteTitle: string,
  noteDescription: string,
  showDescField: boolean,
}

class Note extends React.Component<Props, State> {
  state = {
    noteTitle: this.props.currentNote.title,
    noteDescription: this.props.currentNote.description,
    showDescField: false,
  };

  componentDidMount() {
    this.props.fetchCurrentNote(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    const { currentNote } = this.props;
    if (currentNote.description !== prevProps.currentNote.description) {
      this.setState({ noteDescription: currentNote.description });
    }
  }

  toggleDescField = () => {
    this.setState((prevState) => ({
      showDescField: !prevState.showDescField,
    }));
  }

  handleSaveDescription = () => {
    const { currentNote } = this.props;
    if (!currentNote._id) {
      return;
    }
    this.props.changeNoteDescription({
      id: currentNote._id,
      description: this.state.noteDescription,
    })
    this.setState({ showDescField: false });
  }

  handleDescriptionChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    this.setState({ noteDescription: value })
  }

  renderDescriptionField = () => {
    const { showDescField, noteDescription } = this.state;
    if (!showDescField) {
      return (
        <div onClick={this.toggleDescField}>
          {noteDescription ? noteDescription : 'Add description'}
        </div>
      );
    }

    return (
      <React.Fragment>
        <Input
          type="text"
          value={noteDescription}
          onChange={this.handleDescriptionChange}
          onBlur={this.handleSaveDescription}
          className={s.descriptionInput}
          textArea
          autoFocus
        />
        <div>
          <Button
            text="Save"
            theme="info"
            shape="link"
          />
        </div>
      </React.Fragment>
    );
  }

  renderEditor = () => {
    const { currentNote } = this.props;
    if (currentNote.contentSettings.hideTextEditor) {
      return null;
    }

    return (
      <MarkdownEditor
        noteId={currentNote._id}
        noteText={currentNote.text}
      />
    );
  }

  renderTodoLists = () => {
    const { currentNote } = this.props;
    if (currentNote.contentSettings.hideLists) {
      return null;
    }

    return (
      <ToDoLists />
    );
  }

  render() {
    const { currentNote } = this.props;
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
        <div className={s.descriptionBlock}>
          <div className={s.sectionHeader}>Description</div>
          <div className={s.descriptionText}>
            {this.renderDescriptionField()}
          </div>
        </div>
        {this.renderEditor()}
        {this.renderTodoLists()}
      </div>
    );
  }
}

const mapState = (state: ReduxState) => {
  return {
    currentNote: state.notes.current,
  };
};

const mapDispatch = {
  fetchCurrentNote,
  changeNoteDescription,
};

export default connect(mapState, mapDispatch)(Note);
