import React, { useState } from 'react';
import crypto from 'crypto-js';
import { ipcRenderer } from 'electron';

import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';

import s from './Auth.css';

interface Props {
  onSubmit: (p: string) => void,
  inputClassName?: string,
  inputPlaceholder?: string,
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

  const renderError = () => {
    if (isPassValid) {
      return null;
    }

    return (
      <div className={s.error}>
        Password is incorrect
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
        theme="info"
        disabled={!pass || props.disableButton}
        onClick={handleValidate}
        className={buttonClassName}
      />
    );
  };

  return (
    <React.Fragment>
      <Input
        type="password"
        theme="password"
        placeholder={props.inputPlaceholder ? props.inputPlaceholder : 'Enter your password'}
        value={pass}
        onChange={handlePassChange}
        className={props.inputClassName}
        onKeyDown={handleKeyPress}
      />
      {props.children}
      {renderError()}
      {renderButton()}
    </React.Fragment>
  );
};

export default AuthConfirmation;
