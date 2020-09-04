import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import useOutsideClick from 'utils/clickHook';

// components
import Button from 'ui/Button/Button';
import Transition from 'ui/Transition/Transition';

// types
import { ContextMenuAction } from 'types/entities';
import { IconName } from '@fortawesome/fontawesome-svg-core';

// css
import s from './ContextMenu.css';

interface Props {
  id: string,
  actions: ContextMenuAction[],
  icon?: IconName,
  menuText?: string,
  menuClassName?: string,
  menuIconClassName?: string,
}

const ContextMenu: React.FC<Props> = (props) => {
  const containerElem = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const withChildren = !_.isEmpty(props.children);

  const closeMenu = () => {
    setShowMenu(false);
  };
  useEffect(() => useOutsideClick(containerElem.current, closeMenu), [closeMenu]);

  const handleContextClick = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMenuPosition({
      top: clientY,
      left: clientX,
    });

    toggleMenu();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const executeAction = (execute: ContextMenuAction['execute']) => () => {
    setShowMenu(false);
    execute();
  };

  const btnText = props.menuText ? props.menuText : '';
  const btnTheme = btnText ? 'primary' : 'info';
  const btnShape = btnText ? 'text' : 'icon';

  const { menuClassName, actions } = props;

  const classes = menuClassName ? `${s.contextMenu} ${menuClassName}` : s.contextMenu;

  const actionList = _.map(actions, (action) => (
    <Button
      theme="primary"
      shape="text"
      key={action.title}
      text={action.title}
      icon={action.icon}
      className={s.contextMenuItem}
      onClick={executeAction(action.execute)}
    />
  ));

  const renderMenuTrigger = () => {
    if (!withChildren) {
      return (
        <Button
          theme={btnTheme}
          shape={btnShape}
          text={btnText}
          icon={props.icon ? props.icon : 'ellipsis-v'}
          onClick={toggleMenu}
          className={props.menuIconClassName}
        />
      );
    }

    return props.children;
  };

  const contextEvent = withChildren ? { onContextMenu: handleContextClick } : {};
  return (
    <div className={s.menuWrapper} ref={containerElem} id={props.id} {...contextEvent}>
      {renderMenuTrigger()}
      <Transition
        show={showMenu}
        duration={150}
        enter={s.contextMenuActive}
        exit={s.contextMenuDone}
      >
        <div className={classes} style={withChildren ? menuPosition : {}}>
          {actionList}
        </div>
      </Transition>
    </div>
  );
};

export default ContextMenu;
