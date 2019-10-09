import React from 'react';
import { ipcRenderer } from 'electron';
import crypto from 'crypto-js';
import { connect } from 'react-redux';

// actions
import { dispatchToastr } from 'actions/toastr';

// components
import PasswordInput from 'ui/Auth/PasswordInput';

// css
import s from './EncryptionSection.css';

type MapDispatch = typeof mapDispatch;

const ChangePassword: React.FC<MapDispatch> = (props) => {
  const handleSubmit = (encPass: string, newPass: string = '') => {
    const newEncPass = crypto.SHA512(newPass).toString();
    ipcRenderer.send('change-hash', { oldHash: encPass, newHash: newEncPass });
    props.dispatchToastr({ message: 'Password changed.' });
  };

  return (
    <div className={s.section}>
      <div className={s.sectionSubtitle}>Change password</div>
      <PasswordInput
        mode="changePassword"
        onSubmit={handleSubmit}
        inputClassName={s.input}
        passText="Current password"
        buttonText="Change"
      />
    </div>
  );
};

const mapDispatch = {
  dispatchToastr,
};

export default connect(null, mapDispatch)(ChangePassword);
