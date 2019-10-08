import React from 'react';
import classNames from 'classnames';

import s from './Button.css';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  id?: string,
  text: string,
  type?: 'button' | 'submit',
  shape?: 'block' | 'outline' | 'text' | 'icon',
  theme: 'primary' | 'info' | 'danger',
  size?: 'm' | 'lg',
  className?: string,
  onClick?: () => void,
  disabled?: boolean,
  icon?: IconName,
}

const Button = (props: Props) => {
  const {
    theme,
    text,
    shape,
    className,
    type,
    icon,
    size = 'sm',
    ...rest
  } = props;
  const iconOnly = shape === 'icon';
  const themeClass = () => {
    const shapeClass = shape ? s[shape] : s.block;
    const defaultClasses = classNames(shapeClass, s[theme]);
    if (iconOnly) {
      return classNames(defaultClasses, s[`${size}Size`]);
    }

    return defaultClasses;
  };

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    const iconSize = iconOnly ? size : 'm';
    const iconClasses = classNames(s[`${iconSize}IconSize`], {
      [s.btnIcon]: !iconOnly,
    });
    return (
      <span className={iconClasses}><FontAwesomeIcon icon={icon} /></span>
    );
  };

  const btnClasses = classNames(s.button, themeClass(), className);

  return (
    <button {...rest} type={type || 'button'} className={btnClasses}>
      {renderIcon()} {text}
    </button>
  );
};

export default Button;
