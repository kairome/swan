import React, { useState } from 'react';

// components
import ChangePassword from 'pages/Settings/sections/ChangePassword';
import EncryptionSection from 'pages/Settings/sections/EncryptionSection';
import { ipcRenderer } from 'electron';

const Encryption: React.FC = () => {
  const [isProtected, setIsProtected] = useState(ipcRenderer.sendSync('get-auth-status'));

  const updateProtectedStatus = () => {
    setIsProtected(ipcRenderer.sendSync('get-auth-status'));
  };

  const renderContent = () => {
    if (!isProtected) {
      return null;
    }

    return (
      <React.Fragment>
        <ChangePassword />
      </React.Fragment>
    );
  };
  return (
    <div>
      <h3>Encryption and privacy</h3>
      <EncryptionSection
        isProtected={isProtected}
        updateProtectedStatus={updateProtectedStatus}
      />
      {renderContent()}
    </div>
  );
};

export default Encryption;
