import React, { useState } from 'react';
import Input, { InputProps } from 'ui/Input/Input';

interface CommonProps {
  defaultText: string,
  save: () => void,
  reset: () => void,
  textArea?: boolean,
  textClassName?: string,
}

type InputFieldProps = InputProps & CommonProps;

type Props = InputFieldProps;

const EditableField: React.FC<Props> = (props) => {
  const [editMode, setEditMode] = useState(false);
  const { defaultText, textArea, textClassName, save, reset, ...fieldProps } = props;

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (!editMode) {
    return (
      <div onClick={toggleEditMode} className={textClassName}>
        {defaultText}
      </div>
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      setEditMode(false);
      e.currentTarget.blur();
    }

    if (key === 'Escape') {
      setEditMode(false);
      reset();
    }
  };

  const handleBlur = () => {
    save();
    setEditMode(false);
  };

  return (
    <Input
      {...fieldProps}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      autoFocus
      embedded
      textArea={textArea}
    />
  );
};

export default EditableField;
