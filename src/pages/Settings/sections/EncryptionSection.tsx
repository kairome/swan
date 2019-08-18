import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import crypto from 'crypto-js';
import { connect } from 'react-redux';

// actions
import { dispatchToastr } from 'actions/toastr';

// components
import AuthConfirmation from 'ui/Auth/AuthConfirmation';
import Modal from 'ui/Modal/Modal';
import Button from 'ui/Button/Button';
import ClearDataModal from 'ui/Auth/ClearDataModal';
import NewPassword from 'pages/Settings/sections/NewPassword';

import s from './SettingsSections.css';

interface PassState {
  newPass: string,
  confirmPass: string,
}

const defaultPassState = {
  newPass: '',
  confirmPass: '',
};

type MapDispatch = typeof mapDispatch;
type Props = MapDispatch & {
  isProtected: boolean,
  updateProtectedStatus: () => void,
};

const EncryptionSection: React.FC<Props> = props => {
  const [showEncModal, setShowEncModal] = useState(false);
  const [passState, setPassState] = useState<PassState>(defaultPassState);

  const toggleEncModal = () => {
    setShowEncModal(!showEncModal);
  };

  const handleNewPassChange = (type: 'newPass' | 'confirmPass', value: string) => {
    const state = { ...passState };
    state[type] = value;
    setPassState(state);
  };

  const handleEncryptionOff = (encPass: string) => {
    ipcRenderer.send('turn-encryption-off', encPass);
    toggleEncModal();
    props.updateProtectedStatus();
    props.dispatchToastr({ message: 'Encryption turned off.' });
  };

  const handleEncryptionOn = () => {
    const newEncPass = crypto.SHA512(passState.newPass).toString();
    ipcRenderer.send('turn-encryption-on', newEncPass);
    setPassState(defaultPassState);
    toggleEncModal();
    props.updateProtectedStatus();
    props.dispatchToastr({ message: 'Encryption turned on.' });
  };

  const renderEncryptionModalBody = () => {
    if (!props.isProtected) {
      const { newPass, confirmPass } = passState;
      return (
        <React.Fragment>
          <div className={s.encMessage}>Set a password to encrypt data with.</div>
          <NewPassword
            newPass={newPass}
            confirmPass={confirmPass}
            onChange={handleNewPassChange}
          />
          <div className={s.encryptionModalButtons}>
            <Button
              text="Encrypt"
              theme="info"
              onClick={handleEncryptionOn}
              disabled={!newPass || newPass !== confirmPass}
            />
            <Button
              text="Cancel"
              theme="danger"
              className={s.cancelBtn}
              onClick={toggleEncModal}
            />
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className={s.encMessage}>
          <div>Are you sure you want to turn off encryption?</div>
          <div>All data will be unprotected and stored in plain text.</div>
          <p>Enter password to confirm.</p>
        </div>
        <AuthConfirmation
          inputClassName={s.input}
          inputPlaceholder="Password"
          onSubmit={handleEncryptionOff}
        />
        <Button
          text="Cancel"
          theme="danger"
          onClick={toggleEncModal}
        />
      </React.Fragment>
    );
  };

  const renderEncryptionModal = () => (
    <Modal show={showEncModal} toggle={toggleEncModal}>
      <div>
        {renderEncryptionModalBody()}
      </div>
    </Modal>
  );

  const renderContent = () => {
    if (!props.isProtected) {
      return (
        <React.Fragment>
          <p>Encryption is disabled. Your local data is not protected and stored in plain text.</p>
          <p>That means that anybody with access to the data can read it.</p>
          <p> If synchronization is enabled, your notes will not be secure during transfer.</p>
          <div className={s.encryptionButton} onClick={toggleEncModal}>
            Turn encryption on
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <p>Encryption is enabled.</p>
        <p>Your local data is protected with your password and encrypted before storing on the local device.</p>
        <p>If synchronization is enabled, the notes are secure during transfer.</p>
        <div className={s.encryptionOffButton} onClick={toggleEncModal}>
          Turn encryption off
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className={s.section}>
      <h4>Encryption</h4>
      {renderContent()}
      <ClearDataModal />
      {renderEncryptionModal()}
    </div>
  );
};

const mapDispatch = {
  dispatchToastr,
};

export default connect(null, mapDispatch)(EncryptionSection);
