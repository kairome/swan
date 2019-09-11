import React, { useRef, useState } from 'react';
import useOutsideClick from 'utils/clickHook';
import _ from 'lodash';
import classNames from 'classnames';

// css
import { OptionValue } from 'types/entities';
import s from './Options.css';

// types

interface Props {
  value: string | number,
  options: OptionValue[],
  onChange: (v: string | number) => void,
}

const Options: React.FC<Props> = (props) => {
  const containerElem = useRef<HTMLDivElement | null>(null);
  const [showOptions, toggleOptions] = useState(false);
  useOutsideClick(containerElem.current, toggleOptions);

  const { value, options } = props;

  const renderOptions = () => {
    if (!showOptions) {
      return null;
    }

    const list = _.map(options, (option) => {
      const handleClick = () => {
        props.onChange(option.value);
        toggleOptions(false);
      };

      const optionClasses = classNames(s.option, {
        [s.currentOption]: option.value === value,
      });
      return (
        <div key={option.value} className={optionClasses} onClick={handleClick}>
          {option.label}
        </div>
      );
    });

    return (
      <div className={s.optionsList}>
        {list}
      </div>
    );
  };

  const currentValue = _.find(options, o => o.value === value);

  return (
    <div ref={containerElem} className={s.optionsContainer}>
      <div onClick={() => toggleOptions(true)} className={s.selectedValue}>
        {currentValue ? currentValue.label : ''}
      </div>
      {renderOptions()}
    </div>
  );
};

export default Options;
