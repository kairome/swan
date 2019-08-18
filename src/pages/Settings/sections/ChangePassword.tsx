import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import crypto from 'crypto-js';
import { connect } from 'react-redux';

// actions
import { dispatchToastr } from 'actions/toastr';

// components
import AuthConfirmation from 'ui/Auth/AuthConfirmation';
import NewPassword from 'pages/Settings/sections/NewPassword';

import s from './SettingsSections.css';

interface State {
  newPass: string,
  confirmPass: string,
}

const defaultState = {
  newPass: '',
  confirmPass: '',
};

type MapDispatch = typeof mapDispatch;

const ChangePassword: React.FC<MapDispatch> = props => {
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
    });
    props.dispatchToastr({ message: 'Password changed.' });
  };

  const isChangeDisabled = () => {
    const { newPass, confirmPass } = passState;
    return !newPass || newPass !== confirmPass;
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
      </AuthConfirmation>
    </div>
  );
};

const mapDispatch = {
  dispatchToastr,
};

export default connect(null, mapDispatch)(ChangePassword);
