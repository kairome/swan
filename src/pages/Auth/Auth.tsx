import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

// components
import AuthConfirmation from 'ui/Auth/AuthConfirmation';
import ClearDataModal from 'ui/Auth/ClearDataModal';

import s from './Auth.css';

const Auth: React.FC = () => {
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (encPass: string) => {
    ipcRenderer.send('save-hash', encPass);
  };

  const handleForgotClick = () => {
    setShowForgot(true);
  };

  const renderForgotMessage = () => {
    if (showForgot) {
      return (
        <div className={s.forgotMessageBlock}>
          <div className={s.forgotMessage}>
            If you forgot your password, the only option is to clear all data.
          </div>
          <ClearDataModal />
        </div>
      );
    }

    return (
      <div className={s.forgot} onClick={handleForgotClick}>
        Forgot password?
      </div>
    );
  };

  return (
    <div className={s.authPage}>
      <div className={s.authContent}>
        <div className={s.authModal}>
          <div className={s.authHeader}>Authentication</div>
          <div className={s.authForm}>
            <AuthConfirmation
              inputClassName={s.authInput}
              buttonClassName={s.authButton}
              buttonText="Unlock"
              onSubmit={handleSubmit}
            />
            {renderForgotMessage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
