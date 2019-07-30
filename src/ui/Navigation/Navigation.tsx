import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import history from 'utils/history';
import { RouteComponentProps, withRouter } from 'react-router';

// actions
import { toggleNavigation } from 'actions/navigation';

// components
import TopInfoBar from 'ui/Navigation/TopBar/TopInfoBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FoldersList from 'pages/Folders/FoldersList';

// types
import { ReduxState } from 'types/redux';

// css

import s from './Navigation.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & RouteComponentProps;

const Navigation: React.FC<Props> = props => {
  const handleArchivedRedirect = () => {
    history.push('/archived');
  };

  const renderNavBars = () => {
    if (!props.show) {
      return null;
    }

    return (
      <div className={s.navIconContainer} onClick={props.toggleNavigation}>
        <FontAwesomeIcon
          icon="bars"
          className={s.navIcon}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (!props.show) {
      return null;
    }

    const archivedClasses = classNames(s.archivedSection, {
      [s.archivedSectionActive]: props.location.pathname === '/archived',
    });

    return (
      <React.Fragment>
        <FoldersList />
        <div className={archivedClasses} onClick={handleArchivedRedirect}>
          <FontAwesomeIcon icon="inbox" /> Archived
        </div>
      </React.Fragment>
    );
  };

  const navClasses = classNames(s.mainNavigation, {
    [s.hideNavigation]: !props.show,
  });

  return (
    <React.Fragment>
      <TopInfoBar />
      <div className={s.relative}>
        {renderNavBars()}
        <div className={navClasses}>
          {renderContent()}
        </div>
      </div>
    </React.Fragment>
  );
};

const mapState = (state: ReduxState) => ({
  show: state.navigation.show,
});

const mapDispatch = {
  toggleNavigation,
};

export default connect(mapState, mapDispatch)(withRouter(Navigation));
