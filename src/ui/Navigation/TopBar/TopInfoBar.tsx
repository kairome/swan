import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import history from 'utils/history';
import _ from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';

// actions, selectors
import { getCurrentFolderSelector } from 'selectors/folders';
import { getCurrentNoteSelector } from 'selectors/notes';
import { toggleNavigation } from 'actions/navigation';
import { getLoader } from 'selectors/common';

// components
import TopBarNoteOptions from 'ui/Navigation/TopBar/TopBarNoteOptions';
import TopBarFolderOptions from 'ui/Navigation/TopBar/TopBarFolderOptions';
import Button from 'ui/Button/Button';

// types
import { ReduxState } from 'types/redux';

// css
import s from './TopBar.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & RouteComponentProps;

const TopInfoBar: React.FC<Props> = (props) => {
  const { currentFolder, currentNote, show } = props;

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
      <Button
        text=""
        theme="info"
        shape="icon"
        onClick={handleBackClick}
        icon="arrow-left"
        className={s.noteBackArrow}
      />
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
    if (props.currentFolderLoading) {
      return null;
    }

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
      <Button
        text=""
        theme="info"
        shape="icon"
        onClick={props.toggleNavigation}
        icon="bars"
        size="lg"
        className={s.infoBarIconContainer}
      />
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
  currentFolderLoading: getLoader(state, 'currentFolder'),
});

const mapDispatch = {
  toggleNavigation,
};

export default connect(mapState, mapDispatch)(withRouter(TopInfoBar));
