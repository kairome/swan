import React, { useState } from 'react';

// components
import EncryptionSection from './encryption/EncryptionSection';
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
    props.handleNavigate('encryption');
    setEncModalTrigger(true);
  };

  switch (pageId) {
    case 'encryption':
      return (
        <EncryptionSection triggerEncModal={triggerEncModal} />
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
