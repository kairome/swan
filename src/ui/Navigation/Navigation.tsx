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
import Settings from 'pages/Settings/Settings';

// types
import { ReduxState } from 'types/redux';

// css
import s from './Navigation.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch & RouteComponentProps;

const Navigation: React.FC<Props> = (props) => {
  const handleArchiveRedirect = () => {
    history.push('/archived');
  };


  const renderUserMenu = () => (
    <React.Fragment>
      <Settings />
    </React.Fragment>
  );
  const renderContent = () => {
    if (!props.show) {
      return null;
    }

    const archivedClasses = classNames(s.archivedSection, {
      [s.archivedSectionActive]: props.location.pathname === '/archived',
    });

    return (
      <React.Fragment>
        <div className={s.navIconContainer} onClick={props.toggleNavigation}>
          <FontAwesomeIcon
            icon="bars"
            className={s.navIcon}
          />
        </div>
        <div className={s.userMenu}>
          {renderUserMenu()}
        </div>
        <FoldersList />
        <div className={archivedClasses} onClick={handleArchiveRedirect}>
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
