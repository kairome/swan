import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import history from 'utils/history';
import _ from 'lodash';

import { RouteComponentProps, withRouter } from 'react-router';
import { getCurrentFolderSelector } from 'selectors/folders';
import { getCurrentNoteSelector } from 'selectors/notes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toggleNavigation } from 'actions/navigation';
import TopBarNoteOptions from 'ui/Navigation/TopBar/TopBarNoteOptions';
import TopBarFolderOptions from 'ui/Navigation/TopBar/TopBarFolderOptions';

// types
import { ReduxState } from 'types/redux';

import s from './TopBar.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & RouteComponentProps;

const TopInfoBar: React.FC<Props> = props => {
  const { currentFolder, currentNote, show } = props;

  const renderNavBars = () => {
    if (show) {
      return null;
    }

    return (
      <div className={s.infoBarIconContainer} onClick={props.toggleNavigation}>
        <FontAwesomeIcon
          icon="bars"
          className={s.navIcon}
        />
      </div>
    );
  };

  const handleBackClick = () => {
    if (!currentNote._id) {
      return;
    }

    if (currentNote.isArchived) {
      history.push('/archived');
      return;
    }

    history.push(`/folders/${currentNote.folder}`);
  };

  const renderBackArrow = () => {
    if (!_.includes(props.location.pathname, '/notes')) {
      return null;
    }

    return (
      <div onClick={handleBackClick} className={s.noteBackArrow}>
        <FontAwesomeIcon
          icon="arrow-left"
        />
      </div>
    );
  };

  const renderPageOptions = () => {
    if (_.includes(props.location.pathname, '/folders')) {
      return (
        <TopBarFolderOptions />
      );
    }

    if (_.includes(props.location.pathname, '/notes')) {
      return (
        <TopBarNoteOptions />
      );
    }

    return null;
  };

  const getBreadCrumbs = () => {
    if (props.location.pathname === '/archived') {
      return 'Archived';
    }

    const folderName = currentFolder.name ? currentFolder.name : '';
    const noteName = currentNote.title ? ` > ${currentNote.title}` : '';
    return `${folderName}${noteName}`;
  };

  const barClasses = classNames(s.infoBar, {
    [s.infoBarFull]: !show,
  });

  return (
    <div className={barClasses}>
      {renderNavBars()}
      {renderBackArrow()}
      <div className={s.breadcrumbs}>
        {getBreadCrumbs()}
      </div>
      {renderPageOptions()}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  show: state.navigation.show,
  currentFolder: getCurrentFolderSelector(state),
  currentNote: getCurrentNoteSelector(state),
});

const mapDispatch = {
  toggleNavigation,
};

export default connect(mapState, mapDispatch)(withRouter(TopInfoBar));
