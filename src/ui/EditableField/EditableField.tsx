import React, { useEffect, useState } from 'react';
import Input, { InputProps } from 'ui/Input/Input';

interface CommonProps {
  defaultText: string,
  save: () => void,
  reset: () => void,
  textArea?: boolean,
  activateEditMode?: boolean,
  textClassName?: string,
}

type InputFieldProps = InputProps & CommonProps;

type Props = InputFieldProps;

const EditableField: React.FC<Props> = props => {
  const [editMode, setEditMode] = useState(false);
  const {
    defaultText, textArea, textClassName, save, activateEditMode, reset, ...fieldProps
  } = props;

  useEffect(() => {
    if (activateEditMode !== undefined) {
      setEditMode(activateEditMode);
    }
  }, [activateEditMode]);

  const toggleEditMode = () => {
    if (activateEditMode !== undefined) {
      return;
    }

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
