import React from 'react';

// components
import Encryption from 'pages/Settings/sections/Encryption';

// types
import { SettingsPageId } from 'types/entities';

interface Props {
  pageId: SettingsPageId;
}

const SettingsContent: React.FC<Props> = props => {
  const { pageId } = props;
  switch (pageId) {
    case 'encryption':
      return (
        <Encryption />
      );
    default:
      return null;
  }
};

export default SettingsContent;
