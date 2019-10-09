import React, { useEffect, useRef, useState } from 'react';
import useOutsideClick from 'utils/clickHook';
import _ from 'lodash';
import classNames from 'classnames';

import Transition from 'ui/Transition/Transition';

// css
import s from './Options.css';

// types
import { OptionValue } from 'types/entities';

interface Props {
  value: string | number,
  options: OptionValue[],
  onChange: (v: string | number) => void,
}

const Options: React.FC<Props> = (props) => {
  const containerElem = useRef<HTMLDivElement | null>(null);
  const [showOptions, toggleOptions] = useState(false);

  const closeOptions = () => {
    toggleOptions(false);
  };

  useEffect(() => useOutsideClick(containerElem.current, closeOptions), [closeOptions]);

  const { value, options } = props;

  const handleOptionClick = (optionValue: string | number) => () => {
    props.onChange(optionValue);
    closeOptions();
  };

  const renderOptions = () => {
    const list = _.map(options, (option) => {
      const optionClasses = classNames(s.option, {
        [s.currentOption]: option.value === value,
      });
      return (
        <div key={option.value} className={optionClasses} onClick={handleOptionClick(option.value)}>
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
      <Transition
        show={showOptions}
        duration={200}
        enter={s.optionsListActive}
        exit={s.optionsListDone}
      >
        {renderOptions()}
      </Transition>
    </div>
  );
};

export default Options;
