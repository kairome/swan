import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import history from 'utils/history';

// components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'ui/Button/Button';
import AddFolderModal from './AddFolderModal';

// actions, selectors
import { getCurrentFolderSelector, getFoldersSelector } from 'selectors/folders';

// types
import { ReduxState } from 'types/redux';

// css
import s from './Folders.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

class FoldersList extends React.Component<Props, {}> {
  handleFolderClick = (id: string) => () => {
    history.push(`/folders/${id}`);
  }

  renderList = () => {
    const { folders } = this.props;

    const list = _.map(folders, (folder) => {
      const folderClasses = classNames(s.folderItem, {
        [s.active]: this.props.currentFolder._id === folder._id,
      })
      return (
        <div key={folder._id} className={folderClasses}>
          <div className={s.folder} onClick={this.handleFolderClick(folder._id)}>
            <FontAwesomeIcon icon="folder" className={s.folderIcon} />
            {folder.name}
          </div>
          <div className={s.folderActionBtns}>
            <Button
              text="Rename"
              theme="info"
              shape="link"
              className={s.folderItemBtn}
            />
            <Button
              text="Remove"
              theme="danger"
              shape="link"
              className={s.folderItemBtn}
            />
          </div>
        </div>
      );
    });

    return (
      <div className={s.folderList}>
        {list}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className={s.addFolderContainer}>
          <AddFolderModal />
        </div>
        {this.renderList()}
      </div>
    );
  }
}

const mapState = (state: ReduxState) => {
  return {
    folders: getFoldersSelector(state),
    currentFolder: getCurrentFolderSelector(state),
  };
}

const mapDispatch = {
};

export default connect(mapState, mapDispatch)(FoldersList);
