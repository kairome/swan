import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';

// types
import { ContextMenuAction } from 'types/entities';

import s from './ContextMenu.css';

interface Props {
  actions: ContextMenuAction[];
  icon?: React.ReactNode;
  menuClassName?: string;
  menuIconClassName?: string;
}

const ContextMenu: React.FC<Props> = props => {
  const containerElem = useRef<HTMLDivElement | null>(null);
  const [showMenu, toggleMenu] = React.useState(false);

  React.useEffect(() => {
    const handleOutsideClick = (e: Event) => {
      if (containerElem !== null && (containerElem.current as HTMLDivElement).contains((e.target as Node))) {
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

  const executeAction = (execute: ContextMenuAction['execute']) => () => {
    toggleMenu(false);
    execute();
  };

  const renderMenu = () => {
    if (!showMenu) {
      return null;
    }

    const { menuClassName, actions } = props;

    const classes = menuClassName ? `${s.contextMenu} ${menuClassName}` : s.contextMenu;

    const actionList = _.map(actions, (action, index) => (
      <div key={`menu-action-${index}`} className={s.contextMenuItem} onClick={executeAction(action.execute)}>
        <FontAwesomeIcon icon={action.icon} /> {action.title}
      </div>
    ));

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
