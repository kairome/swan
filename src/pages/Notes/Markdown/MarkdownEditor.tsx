import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import useOutsideClick from 'utils/clickHook';

import { changeNoteText, setNoteContentSettings } from 'actions/notes';

import SimpleMde from 'react-simplemde-editor';

// css
import '!style-loader!css-loader!easymde/dist/easymde.min.css';
import s from './Markdown.css';

// types
import { NoteContentSettings } from 'types/notes';

type MapDispatch = typeof mapDispatch;

type Props = MapDispatch & {
  noteId: string,
  noteText: string,
  noteSettings: NoteContentSettings,
  className?: string,
};

interface MdeInstance {
  codemirror: any,
}

const MarkdownEditor: React.FC<Props> = (props) => {
  const { noteSettings } = props;
  const [editorValue, setEditorValue] = useState(props.noteText);
  const timeout = useRef<number | null>(null);
  const mdeInstance = useRef<MdeInstance | null>(null);
  const containerElem = useRef<HTMLDivElement | null>(null);

  // SimpleMDE doesn't update references for some reason, the only way it works is like that
  const lockHeight = useRef(noteSettings.lockEditorHeight);
  const handleOutsideClick = () => {
    if (timeout.current !== null) {
      clearEditorTimeout();
      saveText();
    }
  };

  useEffect(() => {
    lockHeight.current = props.noteSettings.lockEditorHeight;
  }, [props.noteSettings]);

  useEffect(() => useOutsideClick(containerElem.current, handleOutsideClick), [handleOutsideClick]);

  const clearEditorTimeout = () => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };

  useEffect(() => {
    clearEditorTimeout();
    timeout.current = window.setTimeout(() => {
      saveText();
    }, 3000);
    return () => clearEditorTimeout();
  }, [editorValue]);

  const saveText = () => {
    clearEditorTimeout();
    props.changeNoteText({
      text: editorValue,
      id: props.noteId,
    });
  };

  const handleEditorChange = (value: string) => {
    setEditorValue(value);
  };

  const getInstance = (inst: any) => {
    mdeInstance.current = inst;
  };

  const toggleHeight = () => {
    const { noteId } = props;
    props.setNoteContentSettings({
      noteId,
      contentSettings: {
        ...noteSettings,
        lockEditorHeight: !lockHeight.current,
      },
    });
  };

  const options: any = {
    hideIcons: ['guide'],
    status: false,
    toolbar: [
      'bold',
      'italic',
      'strikethrough',
      'heading',
      '|',
      'code',
      'unordered-list',
      'ordered-list',
      'quote',
      '|',
      'link',
      'image',
      'table',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      {

        name: 'lock-height',
        className: 'fa fa-text-height',
        title: 'Lock editor height',
        action: toggleHeight,
      },
    ],
  };

  return (
    <div
      className={classNames(s.mde, props.className, { [s.mdeHeight]: noteSettings.lockEditorHeight })}
      ref={containerElem}
    >
      <SimpleMde
        value={editorValue}
        onChange={handleEditorChange}
        options={options}
        getMdeInstance={getInstance}
      />
    </div>
  );
};

const mapDispatch = {
  changeNoteText,
  setNoteContentSettings,
};

export default connect(null, mapDispatch)(MarkdownEditor);
