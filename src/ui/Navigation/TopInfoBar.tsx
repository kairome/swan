import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getCurrentFolderSelector } from 'selectors/folders';
import { getCurrentNoteSelector } from 'selectors/notes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toggleNavigation } from 'actions/navigation';

// types
import { ReduxState } from 'types/redux';

// css
import s from './Navigation.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

class TopInfoBar extends React.Component<Props, {}> {
  renderNavBars = () => {
    if (this.props.show) {
      return null;
    }

    return (
      <div className={s.infoBarIconContainer} onClick={this.props.toggleNavigation}>
        <FontAwesomeIcon
          icon="bars"
          className={s.navIcon}
        />
      </div>
    );
  }

  render() {
    const barClasses = classNames(s.infoBar, {
      [s.infoBarFull]: !this.props.show,
    })

    const { currentFolder, currentNote } = this.props;
    const folderName = currentFolder.name ? currentFolder.name : '';
    const noteName = currentNote.title ? ` / ${currentNote.title}` : '';
    return (
      <div className={barClasses}>
        {this.renderNavBars()}
        <div className={s.breadcrumbs}>
          {folderName}{noteName}
        </div>
      </div>
    );
  }
}

const mapState = (state: ReduxState) => {
  return {
    show: state.navigation.show,
    currentFolder: getCurrentFolderSelector(state),
    currentNote: getCurrentNoteSelector(state),
  };
}

const mapDispatch = {
  toggleNavigation,
};

export default connect(mapState, mapDispatch)(TopInfoBar);
