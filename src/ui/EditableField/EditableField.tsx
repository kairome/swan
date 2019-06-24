import React from 'react';

import { FieldType } from 'types/fields';
import Input, { InputProps } from 'ui/Input/Input';

interface CommonProps {
  defaultText: string,
  isEditMode: boolean,
  save: () => void,
  reset: () => void,
}

type InputFieldProps = InputProps & CommonProps & {
  fieldType: FieldType.input,
};

type Props = InputFieldProps;

const EditableField = (props: Props) => {
  const { fieldType, defaultText, isEditMode, save, reset, ...fieldProps } = props;

  if (!isEditMode) {
    return (
      <React.Fragment>
        {defaultText}
      </React.Fragment>
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      save();
    }

    if (key === 'Escape') {
      reset();
    }
  };

  switch (props.fieldType) {
    case FieldType.input:
      return (
        <Input
          {...fieldProps}
          onBlur={save}
          onKeyDown={handleKeyPress}
          autoFocus
          embedded
        />
      );
    default:
      return null;
  }
};

export default EditableField;
