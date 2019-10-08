import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

import Radio from 'ui/Radio/Radio';

import s from './CustomizationSection.css';

interface Props {
  currentTheme: string,
}

const Themes: React.FC<Props> = (props) => {
  const [theme, setTheme] = useState(props.currentTheme);

  const handleSetTheme = (value: string) => {
    setTheme(value);
    ipcRenderer.send('change-theme', value);
  };

  const handleThemeChange = (e: React.FormEvent<HTMLInputElement>) => {
    handleSetTheme(e.currentTarget.value);
  };

  const renderThemeWindow = (type: string) => (
    <div className={s[`themeWindow${type}`]} onClick={() => handleSetTheme(type.toLowerCase())}>
      <div className={s[`sidebar${type}`]}>
        <div className={s.themeFolder} />
        <div className={s.themeFolder} />
        <div className={s.themeFolder} />
        <div className={s.themeFolder} />
      </div>
      <div className={s.themeContent}>
        <div className={s.textBlockWrapper}>
          <div className={s[`textBlock${type}`]} />
          <div className={s[`textBlock${type}`]} />
          <div className={s[`textBlock${type}`]} />
          <div className={s[`textBlock${type}`]} />
        </div>
        <div className={s[`text${type}`]} />
        <div className={s[`text${type}`]} />
        <div className={s[`text${type}`]} />
        <div />
        <div />
      </div>
    </div>
  );

  return (
    <div className={s.section}>
      <div className={s.sectionSubtitle}>Theme</div>
      <div className={s.themeSelectorWrapper}>
        <div className={s.themeSelector}>
          <Radio
            value="light"
            name="themeSelector"
            id="light"
            checked={theme === 'light'}
            onChange={handleThemeChange}
          />
          {renderThemeWindow('Light')}
        </div>
        <div className={s.themeSelector}>
          <Radio
            value="dark"
            name="themeSelector"
            id="dark"
            checked={theme === 'dark'}
            onChange={handleThemeChange}
          />
          {renderThemeWindow('Dark')}
        </div>
      </div>
    </div>
  );
};

export default Themes;
