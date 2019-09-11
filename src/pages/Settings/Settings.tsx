import React, { useState } from 'react';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingsNavigation from 'pages/Settings/SettingsNavigation';
import SettingsContent from 'pages/Settings/SettingsContent';

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

  const renderModal = () => {
    if (!showSettings) {
      return null;
    }

    return (
      <div className={s.settingsPage}>
        <div className={s.settingsContent}>
          <div className={s.settingsNavigation}>
            <div className={s.closeButton} onClick={toggleModal}>
              <FontAwesomeIcon icon="arrow-left" />
            </div>
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
    );
  };

  return (
    <React.Fragment>
      <div className={s.settingsButton} onClick={toggleModal}>
        <FontAwesomeIcon icon="cog" /> Settings
      </div>
      {renderModal()}
    </React.Fragment>
  );
};

export default Settings;
