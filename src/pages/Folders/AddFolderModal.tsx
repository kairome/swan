import React from 'react';
import { connect } from 'react-redux';

// actions
import { createFolder } from 'actions/folders';

// components
import Button from 'ui/Button/Button';
import Input from 'ui/Input/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// css

import s from './Folders.css';

interface State {
  show: boolean;
  name: string;
}

type MapDispatch = typeof mapDispatch;
type Props = MapDispatch;

class AddFolderModal extends React.Component<Props, State> {
  state = {
    show: false,
    name: '',
  };

  toggleModal = () => {
    this.setState(prevState => ({ show: !prevState.show, name: '' }));
  };

  handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState({ name: value });
  };

  handleCreate = () => {
    this.props.createFolder(this.state.name);
    this.toggleModal();
  };

  renderInput = () => {
    if (!this.state.show) {
      return null;
    }

    return (
      <div className={s.addFolderBody}>
        <Input
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
          placeholder="Folder name"
          autoFocus
        />
        <div className={s.folderActionBtns}>
          <Button
            text="Save"
            theme="info"
            className={s.actionBtn}
            disabled={!this.state.name}
            onClick={this.handleCreate}
          />
          <Button
            text="Cancel"
            theme="danger"
            onClick={this.toggleModal}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className={s.addFolderButton} onClick={this.toggleModal}>
          <FontAwesomeIcon icon="folder-plus" /> New folder
        </div>
        {this.renderInput()}
      </React.Fragment>
    );
  }
}

const mapDispatch = {
  createFolder,
};

export default connect(null, mapDispatch)(AddFolderModal);
