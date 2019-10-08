import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import crypto from 'crypto-js';
import { connect } from 'react-redux';

// actions
import { dispatchToastr } from 'actions/toastr';
import { revokeGoogleCredentials } from 'actions/user';

// components
import Modal from 'ui/Modal/Modal';
import Button from 'ui/Button/Button';
import ClearDataModal from 'ui/Auth/ClearDataModal';
import PasswordInput from 'ui/Auth/PasswordInput';

// types
import { ReduxState } from 'types/redux';

// css
import s from './EncryptionSection.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & {
  isProtected: boolean,
  updateProtectedStatus: () => void,
  triggerEncModal: boolean,
};

const EncryptionInfo: React.FC<Props> = (props) => {
  const [showEncModal, setShowEncModal] = useState(props.triggerEncModal);

  const toggleEncModal = () => {
    setShowEncModal(!showEncModal);
  };

  const handleEncryptionOff = (encPass: string) => {
    toggleEncModal();
    const { sync } = props;
    if (sync !== null) {
      props.revokeGoogleCredentials(sync.googleCredentials.refresh_token);
    }
    ipcRenderer.send('turn-encryption-off', encPass);
    props.dispatchToastr({ message: 'Encryption disabled.' });
    props.updateProtectedStatus();
  };

  const handleEncryptionOn = (pass: string) => {
    const newEncPass = crypto.SHA512(pass).toString();
    ipcRenderer.send('turn-encryption-on', newEncPass);
    toggleEncModal();
    props.updateProtectedStatus();
    props.dispatchToastr({ message: 'Encryption enabled.' });
  };

  const renderModalFooter = () => (
    <Button
      text="Cancel"
      theme="danger"
      shape="text"
      onClick={toggleEncModal}
    />
  );

  const renderEncryptionModalBody = () => {
    if (!props.isProtected) {
      return (
        <React.Fragment>
          <div className={s.encMessage}>Set a password to encrypt data with.</div>
          <PasswordInput
            mode="newPassword"
            onSubmit={handleEncryptionOn}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className={s.encMessage}>
          <div>Are you sure you want to turn off encryption?</div>
          <div>All data will be unprotected and stored in plain text.</div>
          <p><b>If sync is enabled, the access to google drive will be revoked.</b></p>
        </div>
        <PasswordInput
          inputClassName={s.input}
          mode="authConfirmation"
          onSubmit={handleEncryptionOff}
        />
      </React.Fragment>
    );
  };

  const renderEncryptionModal = () => (
    <Modal
      title={props.isProtected ? 'Disable encryption' : 'Enable encryption'}
      show={showEncModal}
      toggle={toggleEncModal}
      footer={renderModalFooter()}
    >
      {renderEncryptionModalBody()}
    </Modal>
  );

  const renderContent = () => {
    if (!props.isProtected) {
      return (
        <React.Fragment>
          <p>Encryption is disabled. Your local data is not protected and stored in plain text.</p>
          <p>That means that anybody with access to the data can read it.</p>
          <Button
            text="Enable encryption"
            theme="primary"
            onClick={toggleEncModal}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <p>Encryption is enabled.</p>
        <p>Your local data is protected with your password and encrypted before storing on the local device.</p>
        <p>If synchronization is enabled, the notes are secure during transfer.</p>
        <Button
          text="Disable encryption"
          theme="primary"
          onClick={toggleEncModal}
        />
      </React.Fragment>
    );
  };

  return (
    <div className={s.section}>
      <div className={s.sectionSubtitle}>Encryption</div>
      {renderContent()}
      <ClearDataModal />
      {renderEncryptionModal()}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  sync: state.user.sync,
});

const mapDispatch = {
  dispatchToastr,
  revokeGoogleCredentials,
};

export default connect(mapState, mapDispatch)(EncryptionInfo);
