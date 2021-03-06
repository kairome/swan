import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import s from './CheckBox.css';

interface Props {
  id: string,
  checked: boolean,
  onChange: (e: React.FormEvent<HTMLInputElement>) => void,
  className?: string,
}

const CheckBox = (props: Props) => {
  const { className, id, ...rest } = props;
  const inputClasses = classNames(s.checkboxInput, className);
  return (
    <div className={s.checkboxContainer}>
      <input
        type="checkbox"
        className={inputClasses}
        id={id}
        {...rest}
      />
      <label className={s.checkboxLabel} htmlFor={id}>
        <div className={s.checkMark}>
          <FontAwesomeIcon icon="check" />
        </div>
      </label>
    </div>
  );
};

export default CheckBox;
