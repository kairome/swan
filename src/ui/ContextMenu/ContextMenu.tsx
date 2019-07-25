import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

import s from './ContextMenu.css';

interface MenuAction {
  title: string | React.ReactNode,
  execute: () => void,
}

interface Props {
  actions: MenuAction[],
  icon?: React.ReactNode,
  menuClassName?: string,
  menuIconClassName?: string,
}

const ContextMenu: React.FC<Props> = (props) => {
  const containerElem = React.useRef(null);
  const [showMenu, toggleMenu] = React.useState(false);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerElem !== null && (containerElem.current as any).contains(e.target)) {
        return;
      }

      toggleMenu(false);
    };

    window.addEventListener('click', handleOutsideClick, false);
    return () => {
      window.removeEventListener('click', handleOutsideClick, false);
    };
  });
  const handleMenuToggle = () => {
    toggleMenu(!showMenu);
  };

  const executeAction = (execute: MenuAction['execute']) => () => {
    toggleMenu(false);
    execute();
  };

  const renderMenu = () => {
    if (!showMenu) {
      return null;
    }

    const { menuClassName, actions } = props;

    const classes = menuClassName ? `${s.contextMenu} ${menuClassName}` : s.contextMenu;

    const actionList = _.map(actions, (action, index) => {
      return (
        <div key={`menu-action-${index}`} className={s.contextMenuItem} onClick={executeAction(action.execute)}>
          {action.title}
        </div>
      );
    });

    return (
      <div className={classes}>
        {actionList}
      </div>
    );
  };

  const renderIcon = () => {
    const { icon, menuIconClassName } = props;
    if (icon === undefined) {
      const iconClassName = menuIconClassName ? `${s.menuIcon} ${menuIconClassName}` : s.menuIcon;
      return (
        <div className={iconClassName} onClick={handleMenuToggle}>
          <FontAwesomeIcon icon="ellipsis-v" />
        </div>
      );
    }

    return (
      <div onClick={handleMenuToggle}>
        {icon}
      </div>
    );
  };

  return (
    <div className={s.menuWrapper} ref={containerElem}>
      {renderIcon()}
      {renderMenu()}
    </div>
  );
};

export default ContextMenu;
