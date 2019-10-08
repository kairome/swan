import React from 'react';

// components
import Input from 'ui/Input/Input';

import s from './Auth.css';

type PassField = 'newPass' | 'confirmPass';

interface Props {
  newPass: string,
  confirmPass: string,
  onChange: (type: PassField, confirm: string) => void,
  submit: () => void,
}

const NewPassword: React.FC<Props> = (props) => {
  const handleInputChange = (type: PassField) => (e: React.FormEvent<HTMLInputElement>) => {
    props.onChange(type, e.currentTarget.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      props.submit();
    }
  };

  return (
    <React.Fragment>
      <div className={s.passText}>New password</div>
      <Input
        type="password"
        theme="password"
        className={s.passInput}
        value={props.newPass}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange('newPass')}
      />
      <div className={s.passText}>Confirm new password</div>
      <Input
        type="password"
        theme="password"
        className={s.passInput}
        value={props.confirmPass}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange('confirmPass')}
      />
    </React.Fragment>
  );
};

export default NewPassword;
