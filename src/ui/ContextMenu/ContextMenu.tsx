import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import s from './ContextMenu.css';


interface Props {

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

  const renderMenu = () => {
    if (!showMenu) {
      return null;
    }

    return (
      <div className={s.contextMenu}>Menu</div>
    );
  };

  return (
    <div className={s.menuWrapper} ref={containerElem}>
      <div className={s.menuIcon} onClick={handleMenuToggle}>
        <FontAwesomeIcon icon="ellipsis-v" />
      </div>
      {renderMenu()}
    </div>
  );
};

export default ContextMenu;
