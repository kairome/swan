import React, { useState } from 'react';
import crypto from 'crypto-js';
import { ipcRenderer } from 'electron';
import classNames from 'classnames';

import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';

import s from './Auth.css';

interface Props {
  mode: 'authConfirmation' | 'changePassword' | 'newPassword',
  onSubmit: (p: string, v?: string) => void,
  inputClassName?: string,
  passText?: string,
  modalButton?: React.ReactNode,
  buttonClassName?: string,
  buttonText?: string,
  disableButton?: boolean,
}

const PasswordInput: React.FC<Props> = (props) => {
  const [pass, setPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isPassValid, setPassValid] = useState(true);
  const [isConfirmValid, setConfirmValid] = useState(true);
  const { mode } = props;

  const handlePassChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPass(e.currentTarget.value);

    if (!isPassValid) {
      setPassValid(true);
    }
  };

  const handleNewPassChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!isConfirmValid) {
      setConfirmValid(true);
    }
    setNewPass(e.currentTarget.value);
  };

  const handleConfirmPassChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!isConfirmValid) {
      setConfirmValid(true);
    }
    setConfirmPass(e.currentTarget.value);
  };

  const handleValidate = () => {
    const isNewPassMode = mode === 'newPassword';
    if ((isNewPassMode || mode === 'changePassword') && isBtnDisabled()) {
      setConfirmValid(false);
      return;
    }
    setNewPass('');
    setConfirmPass('');
    if (isNewPassMode) {
      props.onSubmit(newPass);
      return;
    }

    const encPass = crypto.SHA512(pass).toString();
    const isHashValid = ipcRenderer.sendSync('test-hash', encPass);
    setPass('');
    if (!isHashValid) {
      setPassValid(false);
      return;
    }

    props.onSubmit(encPass, newPass);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      handleValidate();
    }
  };

  const isBtnDisabled = () => {
    const newPassInvalid = newPass !== confirmPass || !newPass || !confirmPass;
    if (mode === 'changePassword') {
      return !pass || newPassInvalid;
    }

    if (mode === 'newPassword') {
      return newPassInvalid;
    }

    return !pass;
  };

  const renderCurrentPassText = () => {
    const textClasses = classNames(s.passText, {
      [s.error]: !isPassValid,
    });

    const { passText = 'Enter your password' } = props;
    return (
      <div className={textClasses}>
        {isPassValid ? passText : 'Invalid password'}
      </div>
    );
  };

  const renderConfirmText = () => {
    const textClasses = classNames(s.passText, {
      [s.error]: !isConfirmValid,
    });

    return (
      <div className={textClasses}>
        {isConfirmValid ? 'Confirm new password' : 'Passwords don\'t match'}
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
        disabled={isBtnDisabled() || props.disableButton}
        onClick={handleValidate}
        className={buttonClassName}
      />
    );
  };

  const renderCurrentPasswordField = () => {
    const inputClasses = classNames(props.inputClassName, {
      [s.inputError]: !isPassValid,
    });
    return (
      <React.Fragment>
        {renderCurrentPassText()}
        <Input
          type="password"
          theme="password"
          value={pass}
          onChange={handlePassChange}
          className={inputClasses}
          onKeyDown={handleKeyPress}
          autoFocus={mode === 'authConfirmation'}
        />
      </React.Fragment>
    );
  };

  const renderNewPassFields = () => {
    const newPassClasses = classNames(s.passInput, {
      [s.inputError]: !isConfirmValid,
    });

    return (
      <React.Fragment>
        <div className={s.passText}>New password</div>
        <Input
          type="password"
          theme="password"
          className={newPassClasses}
          value={newPass}
          onKeyDown={handleKeyPress}
          onChange={handleNewPassChange}
        />
        {renderConfirmText()}
        <Input
          type="password"
          theme="password"
          className={newPassClasses}
          value={confirmPass}
          onKeyDown={handleKeyPress}
          onChange={handleConfirmPassChange}
        />
      </React.Fragment>
    );
  };

  const renderContent = () => {
    switch (mode) {
      case 'changePassword':
        return (
          <React.Fragment>
            {renderCurrentPasswordField()}
            {renderNewPassFields()}
          </React.Fragment>
        );
      case 'authConfirmation':
        return renderCurrentPasswordField();
      case 'newPassword':
        return renderNewPassFields();
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {renderContent()}
      {renderButton()}
    </React.Fragment>
  );
};

export default PasswordInput;
