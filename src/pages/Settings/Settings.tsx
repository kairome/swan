import React, { useState } from 'react';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingsNavigation from 'pages/Settings/SettingsNavigation';
import SettingsContent from 'pages/Settings/SettingsContent';
import Button from 'ui/Button/Button';
import Transition from 'ui/Transition/Transition';

// types
import { SettingsPageId } from 'types/entities';

// css
import s from './Settings.css';

const Settings: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setNavPage] = useState<SettingsPageId>('encryption');

  const handleNavigate = (id: SettingsPageId) => {
    setNavPage(id);
  };

  const toggleModal = () => {
    setShowSettings(!showSettings);
  };

  return (
    <React.Fragment>
      <div className={s.listItemWrapper} onClick={toggleModal}>
        <div className={s.listItem}>
          <FontAwesomeIcon icon="cog" className={s.listIcon} /> Settings
        </div>
      </div>
      <Transition
        show={showSettings}
        enter={s.settingPageActive}
        exit={s.settingPageDone}
        duration={250}
      >
        <div className={s.settingsPage}>
          <div className={s.settingsContent}>
            <div className={s.settingsNavigation}>
              <Button
                text=""
                shape="icon"
                theme="info"
                icon="arrow-left"
                size="lg"
                onClick={toggleModal}
                className={s.closeButton}
              />
              <SettingsNavigation
                pageId={currentPage}
                handleNavigate={handleNavigate}
              />
            </div>
            <div className={s.settingsItemPage}>
              <SettingsContent
                pageId={currentPage}
                handleNavigate={handleNavigate}
              />
            </div>
          </div>
        </div>
      </Transition>
    </React.Fragment>
  );
};

export default Settings;
