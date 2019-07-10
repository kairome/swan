import React from 'react';

import s from './ToDos.css';

interface Props {
  listKey: string,
  value: string,
  onChange: (v: string) => void,
}

const PositionSettings: React.FC<Props> = (props) => {
  const { listKey, value } = props;
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    props.onChange(e.currentTarget.value);
  };

  const bottomId = `positionBottom-${listKey}`;
  const offId = `positionOff-${listKey}`;
  const topId = `positionTop-${listKey}`;
  return (
    <div>
      <div className={s.positionTitle}>Checked items</div>
      <input
        id={bottomId}
        type="radio"
        value="bottom"
        checked={'bottom' === value}
        name={listKey}
        className={s.positionInput}
        onChange={handleChange}
      />
      <label htmlFor={bottomId} className={s.positionLabel}>Bottom</label>
      <input
        id={offId}
        type="radio"
        value="off"
        checked={'off' === value}
        name={listKey}
        className={s.positionInput}
        onChange={handleChange}
      />
      <label htmlFor={offId} className={s.positionLabel}>Off</label>
      <input
        id={topId}
        type="radio"
        value="top"
        checked={'top' === value}
        name={listKey}
        className={s.positionInput}
        onChange={handleChange}
      />
      <label htmlFor={topId} className={s.positionLabel}>Top</label>
    </div>
  );
};

export default PositionSettings;
