import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

// components
import ClearDataModal from 'ui/Auth/ClearDataModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Transition from 'ui/Transition/Transition';
import PasswordInput from 'ui/Auth/PasswordInput';

// css
import s from './Auth.css';

interface Props {
  show: boolean,
}

const Auth: React.FC<Props> = (props) => {
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
    <Transition
      show={props.show}
      duration={150}
      enter={s.authPageActive}
      exit={s.authPageDone}
    >
      <div className={s.authPage}>
        <div className={s.authContent}>
          <div className={s.authModal}>
            <div className={s.centerElement}>
              <div className={s.authIcon}>
                <FontAwesomeIcon icon="lock" />
              </div>
            </div>
            <div className={s.authHeader}>App is locked</div>
            <div className={s.authForm}>
              <PasswordInput
                mode="authConfirmation"
                onSubmit={handleSubmit}
                inputClassName={s.authInput}
                buttonClassName={s.authButton}
                buttonText="Unlock"
              />
              {renderForgotMessage()}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Auth;
