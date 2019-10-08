import React from 'react';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SettingsPageId } from 'types/entities';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';

import s from './Settings.css';

interface Props {
  pageId: SettingsPageId,
  handleNavigate: (id: SettingsPageId) => void,
}

interface NavItem {
  id: SettingsPageId,
  title: string,
  icon: IconProp,
}

const SettingsNavigation: React.FC<Props> = (props) => {
  const handleClick = (id: SettingsPageId) => () => {
    props.handleNavigate(id);
  };

  const items: NavItem[] = [
    {
      id: 'encryption',
      title: 'Encryption',
      icon: 'user-lock',
    },
    {
      id: 'sync',
      title: 'Synchronization',
      icon: 'sync',
    },
    {
      id: 'customization',
      title: 'Customization',
      icon: 'palette',
    },
  ];

  const itemsList = _.map(items, (item) => {
    const itemClasses = classNames(s.listItemWrapper, {
      [s.listItemActive]: item.id === props.pageId,
    });

    return (
      <div key={item.id} className={itemClasses}>
        <div className={s.listItem} onClick={handleClick(item.id)}>
          <FontAwesomeIcon icon={item.icon} className={s.listIcon} /> {item.title}
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      {itemsList}
    </React.Fragment>
  );
};

export default SettingsNavigation;
