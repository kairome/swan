import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

// components
import Themes from 'pages/Settings/customization/Themes';
import AccentColor from 'pages/Settings/customization/AccentColor';

// css
import s from 'pages/Settings/sync/SyncSection.css';

const CustomizationSection: React.FC = () => {
  const [theme, setTheme] = useState(ipcRenderer.sendSync('get-theme'));
  ipcRenderer.on('update-theme', () => {
    setTheme(ipcRenderer.sendSync('get-theme'));
  });

  return (
    <div className={s.settingSectionActive}>
      <div className={s.sectionTitle}>Customization</div>
      <Themes currentTheme={theme} />
      <AccentColor currentTheme={theme} />
    </div>
  );
};

export default CustomizationSection;
