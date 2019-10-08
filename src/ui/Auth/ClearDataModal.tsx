import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import history from 'utils/history';

import Confirmation from 'ui/Confirmation/Confirmation';
import Button from 'ui/Button/Button';

const ClearDataModal: React.FC = () => {
  const [showClearModal, setShowClearModal] = useState(false);

  const toggleClearModal = () => {
    setShowClearModal(!showClearModal);
  };

  const clearData = () => {
    ipcRenderer.send('clear-data');
    history.push('/');
  };

  return (
    <div>
      <Button
        text="Clear all data"
        theme="danger"
        shape="text"
        onClick={toggleClearModal}
      />
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
