import React, { useState } from 'react';

// components
import { SettingsPageId } from 'types/entities';
import EncryptionSection from './sections/encryption/EncryptionSection';
import SyncSection from './sections/sync/SyncSection';

// types

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
    default:
      return null;
  }
};

export default SettingsContent;
