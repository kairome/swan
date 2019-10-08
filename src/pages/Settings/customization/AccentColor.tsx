import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

// components
import { ChromePicker, ColorResult } from 'react-color';
import Button from 'ui/Button/Button';

// css
import s from './CustomizationSection.css';

interface Props {
  currentTheme: string,
}

const AccentColor: React.FC<Props> = (props) => {
  const [currentColor, setCurrentColor] = useState(ipcRenderer.sendSync('get-accent-color'));
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor);
  const [colorHistory, setColorHistory] = useState<string[]>([]);

  const getDefaultColors = () => {
    if (props.currentTheme === 'dark') {
      return [
        '#92a1ff',
        '#ffa063',
        '#ffd8a9',
        '#adffe4',
        '#ffc695',
        '#88dbff',
        '#c8ff88',
        '#ca83ff',
        '#e696ff',
      ];
    }

    return [
      '#00138c',
      '#8c1e00',
      '#6f3d00',
      '#008e5f',
      '#9e4a02',
      '#00618c',
      '#4e8c00',
      '#40006f',
      '#6a1384',
    ];
  };

  useEffect(() => {
    handleSetCustomColor(currentColor);
    const uniqColors = _.uniq([currentColor, ...colorHistory]);
    const newColorHistory = uniqColors.length > 10 ? uniqColors.slice(0, 10) : uniqColors;
    setColorHistory(newColorHistory);
  }, [currentColor]);

  const handleAccentColorChange = (color: string) => () => {
    ipcRenderer.send('change-accent-color', color);
    setCurrentColor(color);
  };

  const handleSetCustomColor = (color: string) => {
    document.documentElement.style.setProperty('--triangle-color', color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (color: ColorResult) => {
    handleSetCustomColor(color.hex);
  };

  const handleSaveCustomColor = () => {
    setCurrentColor(customColor);
    ipcRenderer.send('change-accent-color', customColor);
    toggleColorSelector();
  };

  const toggleColorSelector = () => {
    setShowColorSelector(!showColorSelector);
    if (showColorSelector && currentColor !== customColor) {
      handleSetCustomColor(currentColor);
    }
  };

  const renderColorSelector = () => {
    if (!showColorSelector) {
      return null;
    }

    return (
      <div className={s.chromeColorSelect}>
        <div className={s.colorTriangle} />
        <ChromePicker
          color={customColor}
          onChange={handleCustomColorChange}
        />
        <Button
          text="Select"
          theme="primary"
          shape="text"
          className={s.selectColorBtn}
          onClick={handleSaveCustomColor}
        />
      </div>
    );
  };

  const renderColorList = (colors: string[]) => _.map(colors, defaultColor => (
    <div
      key={defaultColor}
      onClick={handleAccentColorChange(defaultColor)}
      className={s.colorBlock}
      style={{ background: defaultColor }}
    />
  ));

  return (
    <div className={s.section}>
      <div className={s.sectionSubtitle}>Accent color</div>
      <div className={s.accentColor}>
        <div className={s.selectWrapper}>
          <div style={{ background: currentColor }} className={s.primaryBlock} onClick={toggleColorSelector} />
          {renderColorSelector()}
        </div>
        <div className={s.colorListWrapper}>
          <div className={s.recentColors}>
            <div className={s.recentTitle}>Recent</div>
            <div className={s.colorList}>
              {renderColorList(colorHistory)}
            </div>
            <div className={s.recentDivider} />
          </div>
          <div className={s.colorList}>
            {renderColorList(getDefaultColors())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccentColor;
