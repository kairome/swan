import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import crypto from 'crypto-js';

// components
import AuthConfirmation from 'ui/Auth/AuthConfirmation';
import NewPassword from 'pages/Settings/sections/NewPassword';

import s from './SettingsSections.css';

interface State {
  newPass: string;
  confirmPass: string;
  changed: boolean;
}

const defaultState = {
  newPass: '',
  confirmPass: '',
  changed: false,
};

const ChangePassword: React.FC = () => {
  const [passState, setPassState] = useState<State>(defaultState);

  const handleNewPassChange = (type: 'newPass' | 'confirmPass', value: string) => {
    const state = { ...passState };
    state[type] = value;
    setPassState(state);
  };

  const handleSubmit = (encPass: string) => {
    if (isChangeDisabled()) {
      return;
    }

    const newEncPass = crypto.SHA512(passState.newPass).toString();
    ipcRenderer.send('change-hash', { oldHash: encPass, newHash: newEncPass });
    setPassState({
      ...defaultState,
      changed: true,
    });
  };

  const isChangeDisabled = () => {
    const { newPass, confirmPass } = passState;
    return !newPass || newPass !== confirmPass;
  };

  const renderMessage = () => {
    if (!passState.changed) {
      return null;
    }

    return (
      <div className={s.success}>
        Password changed!
      </div>
    );
  };

  return (
    <div className={s.section}>
      <h4>Change password</h4>
      <AuthConfirmation
        inputClassName={s.input}
        inputPlaceholder="Current password"
        buttonText="Change"
        disableButton={isChangeDisabled()}
        onSubmit={handleSubmit}
      >
        <NewPassword
          newPass={passState.newPass}
          confirmPass={passState.confirmPass}
          onChange={handleNewPassChange}
        />
        {renderMessage()}
      </AuthConfirmation>
    </div>
  );
};

export default ChangePassword;
