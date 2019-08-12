import React from 'react';

// components
import Input from 'ui/Input/Input';

import s from './SettingsSections.css';

type PassField = 'newPass' | 'confirmPass';

interface Props {
  newPass: string;
  confirmPass: string;
  onChange: (type: PassField, confirm: string) => void;
}

const NewPassword: React.FC<Props> = props => {
  const handleInputChange = (type: PassField) => (e: React.FormEvent<HTMLInputElement>) => {
    props.onChange(type, e.currentTarget.value);
  };

  return (
    <React.Fragment>
      <Input
        type="password"
        theme="password"
        className={s.input}
        value={props.newPass}
        placeholder="New password"
        onChange={handleInputChange('newPass')}
      />
      <Input
        type="password"
        theme="password"
        className={s.input}
        value={props.confirmPass}
        placeholder="Confirm new password"
        onChange={handleInputChange('confirmPass')}
      />
    </React.Fragment>
  );
};

export default NewPassword;
