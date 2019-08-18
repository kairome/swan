import React from 'react';
import classNames from 'classnames';

import s from './Button.css';

interface Props {
  text: string,
  type?: 'button' | 'submit',
  shape?: 'block' | 'link',
  theme: 'info' | 'danger',
  className?: string,
  onClick?: () => void,
  disabled?: boolean,
}

const Button = (props: Props) => {
  const {
    theme,
    text,
    shape,
    className,
    type,
    ...rest
  } = props;
  const themeClass = () => {
    const shapeClass = shape ? s[shape] : s.block;
    switch (theme) {
      case 'info':
        return classNames(shapeClass, s.info);
      case 'danger':
        return classNames(shapeClass, s.danger);
      default:
        return '';
    }
  };

  const btnClasses = classNames(s.button, themeClass(), className);

  return (
    <button {...rest} type={type || 'button'} className={btnClasses}>
      {text}
    </button>
  );
};

export default Button;
