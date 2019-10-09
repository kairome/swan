import React, { useState } from 'react';

// components
import SecuritySection from './security/SecuritySection';
import SyncSection from './sync/SyncSection';
import CustomizationSection from './customization/CustomizationSection';

// types
import { SettingsPageId } from 'types/entities';

interface Props {
  pageId: SettingsPageId,
  handleNavigate: (id: SettingsPageId) => void,
}

const SettingsContent: React.FC<Props> = (props) => {
  const { pageId } = props;
  const [triggerEncModal, setEncModalTrigger] = useState(false);
  const handleEncModalFromSync = () => {
    props.handleNavigate('security');
    setEncModalTrigger(true);
  };

  switch (pageId) {
    case 'security':
      return (
        <SecuritySection triggerEncModal={triggerEncModal} />
      );
    case 'sync':
      return (
        <SyncSection toggleEncModal={handleEncModalFromSync} />
      );
    case 'customization':
      return (
        <CustomizationSection />
      );
    default:
      return null;
  }
};

export default SettingsContent;
