import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

// components
import ChangePassword from './ChangePassword';
import EncryptionInfo from './EncryptionInfo';
import s from 'pages/Settings/sync/SyncSection.css';

interface Props {
  triggerEncModal: boolean,
}

const EncryptionSection: React.FC<Props> = (props) => {
  const [isProtected, setIsProtected] = useState(ipcRenderer.sendSync('get-auth-status'));

  const updateProtectedStatus = () => {
    setIsProtected(ipcRenderer.sendSync('get-auth-status'));
  };

  const renderPasswordSection = () => {
    if (!isProtected) {
      return null;
    }

    return (
      <ChangePassword />
    );
  };

  return (
    <div className={s.settingSectionActive}>
      <div className={s.sectionTitle}>Encryption and privacy</div>
      <EncryptionInfo
        isProtected={isProtected}
        triggerEncModal={props.triggerEncModal}
        updateProtectedStatus={updateProtectedStatus}
      />
      {renderPasswordSection()}
    </div>
  );
};

export default EncryptionSection;
