import React, { useState } from 'react';
import SimpleMde from 'react-simplemde-editor';

import '!style-loader!css-loader!easymde/dist/easymde.min.css';
import { connect } from 'react-redux';
import { changeNoteText } from 'actions/notes';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  noteId: string,
  noteText: string,
};

let timeout: number | undefined;
const MarkdownEditor: React.FC<Props> = (props) => {
  const [editorText, setEditorText] = useState(props.noteText);
  const handleEditorChange = (value: string) => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    setEditorText(value);

    timeout = window.setTimeout(() => {
      props.changeNoteText({
        text: editorText,
        id: props.noteId,
      });
    }, 1000);
  };


  const options = {
    hideIcons: ['guide'],
    status: false,
  };

  return (
    <div>
      <SimpleMde
        value={editorText}
        onChange={handleEditorChange}
        options={options}
      />
    </div>
  );
};

const mapDispatch = {
  changeNoteText,
};

export default connect(null, mapDispatch)(MarkdownEditor);
