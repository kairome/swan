import React from 'react';
import classNames from 'classnames';

import s from './Input.css';

type InputElement = HTMLInputElement | HTMLTextAreaElement;

export interface InputProps {
  type: string,
  value: string,
  onChange: (e: React.FormEvent<InputElement>) => void,
  placeholder?: string,
  className?: string,
  autoFocus?: boolean,
  embedded?: boolean,
  onKeyDown?: (e: React.KeyboardEvent<InputElement>) => void,
  onBlur?: (e: React.FocusEvent<InputElement>) => void,
  onFocus?: (e: React.FocusEvent<InputElement>) => void,
  assignRef?: (elem: InputElement | null) => void,
  textArea?: boolean,
  theme?: 'password',
}

const Input = (props: InputProps) => {
  const {
    className,
    embedded,
    assignRef,
    textArea,
    theme,
    ...rest
  } = props;
  const mainClass = embedded ? s.embeddedInput : s.input;
  const inputClasses = classNames(mainClass, className);

  if (textArea) {
    return (
      <textarea {...rest} className={inputClasses} ref={assignRef} />
    );
  }

  return (
    <input {...rest} className={inputClasses} ref={assignRef} />
  );
};

export default Input;
