import React, { useState } from 'react';
import { connect } from 'react-redux';

// actions
import { createFolder } from 'actions/folders';

// components
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';
import Transition from 'ui/Transition/Transition';

// css
import s from './Folders.css';

type MapDispatch = typeof mapDispatch;
type Props = MapDispatch & {
  folderOrder: number,
};

const AddFolderModal: React.FC<Props> = (props) => {
  const [showInput, setShowInput] = useState(false);
  const [folderName, setFolderName] = useState('');

  const toggleModal = () => {
    setShowInput(!showInput);
    setFolderName('');
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setFolderName(value);
  };

  const handleCreate = () => {
    props.createFolder({
      name: folderName,
      order: props.folderOrder,
    });
    toggleModal();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter' && folderName.trim()) {
      handleCreate();
    }

    if (key === 'Escape') {
      toggleModal();
    }
  };

  return (
    <React.Fragment>
      <Button
        text="New folder"
        theme="primary"
        shape="text"
        icon="folder-plus"
        onClick={toggleModal}
      />
      <Transition
        show={showInput}
        duration={200}
        enter={s.newFolderActive}
        exit={s.newFolderDone}
      >
        <div className={s.addFolderBody}>
          <Input
            type="text"
            value={folderName}
            onChange={handleNameChange}
            placeholder="Folder name"
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <div className={s.folderActionBtns}>
            <Button
              text="Save"
              theme="primary"
              shape="text"
              className={s.actionBtn}
              disabled={!folderName}
              onClick={handleCreate}
            />
            <Button
              text="Cancel"
              theme="info"
              shape="text"
              onClick={toggleModal}
            />
          </div>
        </div>
      </Transition>
    </React.Fragment>
  );
};

const mapDispatch = {
  createFolder,
};

export default connect(null, mapDispatch)(AddFolderModal);
