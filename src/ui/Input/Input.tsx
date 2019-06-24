import React from 'react';
import classNames from 'classnames';

import s from './Input.css';

export interface InputProps {
  type: string,
  value: string,
  onChange: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  placeholder?: string,
  className?: string,
  autoFocus?: boolean,
  embedded?: boolean,
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  assignRef?: (elem: any) => void,
  textArea?: boolean,
}

const Input = (props: InputProps) => {
  const { className, embedded, assignRef, textArea, ...rest } = props;
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
}

export default Input;
