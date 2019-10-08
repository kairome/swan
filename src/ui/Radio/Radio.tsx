import React from 'react';

import s from './Radio.css';

interface Props {
  value: string,
  name: string,
  id: string,
  label?: string,
  checked: boolean,
  onChange: (e: React.FormEvent<HTMLInputElement>) => void,
}

const Radio: React.FC<Props> = (props) => {
  const { label, ...rest } = props;

  const renderLabel = () => {
    if (!label) {
      return null;
    }

    return (
      <label htmlFor={props.id} className={s.label}>{label}</label>
    );
  };

  return (
    <div className={s.radioWrapper}>
      <input
        type="radio"
        className={s.input}
        {...rest}
      />
      <label className={s.radioCircle} htmlFor={props.id}>
        <div className={s.outerCircle}>
          <div className={s.innerCircle} />
        </div>
      </label>
      {renderLabel()}
    </div>
  );
};

export default Radio;
