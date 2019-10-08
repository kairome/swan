import React, { useState } from 'react';
import crypto from 'crypto-js';
import { ipcRenderer } from 'electron';
import classNames from 'classnames';

import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';

import s from './Auth.css';

interface Props {
  onSubmit: (p: string) => void,
  inputClassName?: string,
  inputPlaceholder?: string,
  passText?: string,
  modalButton?: React.ReactNode,
  buttonClassName?: string,
  buttonText?: string,
  children?: React.ReactNode,
  disableButton?: boolean,
}

const AuthConfirmation: React.FC<Props> = (props) => {
  const [pass, setPass] = useState('');
  const [isPassValid, setPassValid] = useState(true);

  const handlePassChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPass(e.currentTarget.value);

    if (!isPassValid) {
      setPassValid(true);
    }
  };

  const handleValidate = () => {
    const encPass = crypto.SHA512(pass).toString();
    const isHashValid = ipcRenderer.sendSync('test-hash', encPass);
    setPass('');
    if (!isHashValid) {
      setPassValid(false);
      return;
    }

    props.onSubmit(encPass);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      handleValidate();
    }
  };

  const renderText = () => {
    const textClasses = classNames(s.passText, {
      [s.error]: !isPassValid,
    });
    const text = props.passText !== undefined ? props.passText : 'Enter your password';
    return (
      <div className={textClasses}>
        {isPassValid ? text : 'Invalid password'}
      </div>
    );
  };

  const renderButton = () => {
    const { buttonClassName, buttonText } = props;
    if (!buttonText) {
      return null;
    }

    return (
      <Button
        text={buttonText}
        theme="primary"
        disabled={!pass || props.disableButton}
        onClick={handleValidate}
        className={buttonClassName}
      />
    );
  };

  const inputClasses = classNames(props.inputClassName, {
    [s.inputError]: !isPassValid,
  });

  return (
    <React.Fragment>
      {renderText()}
      <Input
        type="password"
        theme="password"
        value={pass}
        placeholder={props.inputPlaceholder}
        onChange={handlePassChange}
        className={inputClasses}
        onKeyDown={handleKeyPress}
      />
      {props.children}
      {renderButton()}
    </React.Fragment>
  );
};

export default AuthConfirmation;
