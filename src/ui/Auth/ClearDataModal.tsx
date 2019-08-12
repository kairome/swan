import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

import Confirmation from 'ui/Confirmation/Confirmation';

import s from './Auth.css';

const ClearDataModal: React.FC = () => {
  const [showClearModal, setShowClearModal] = useState(false);

  const toggleClearModal = () => {
    setShowClearModal(!showClearModal);
  };

  const clearData = () => {
    ipcRenderer.send('clear-data');
  };

  return (
    <div>
      <div className={s.clearData} onClick={toggleClearModal}>Clear all data</div>
      <Confirmation
        show={showClearModal}
        toggle={toggleClearModal}
        message="Are you sure you want to clear all local data? This action is irreversible."
        confirm={clearData}
      />
    </div>
  );
};

export default ClearDataModal;
