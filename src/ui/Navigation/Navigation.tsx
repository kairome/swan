import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// actions
import { toggleNavigation } from 'actions/navigation';

// components
import TopInfoBar from 'ui/Navigation/TopInfoBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FoldersList from 'pages/Folders/FoldersList';

// types
import { ReduxState } from 'types/redux';

// css
import s from './Navigation.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

class Navigation extends React.Component<Props, {}> {
  renderNavBars = () => {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className={s.navIconContainer} onClick={this.props.toggleNavigation}>
        <FontAwesomeIcon
          icon="bars"
          className={s.navIcon}
        />
      </div>
    );
  }

  render() {
    const navClasses = classNames(s.mainNavigation, {
      [s.hideNavigation]: !this.props.show,
    });

    return (
      <React.Fragment>
        <TopInfoBar />
        <div className={s.relative}>
          {this.renderNavBars()}
          <div className={navClasses}>
            {this.props.show ? <FoldersList /> : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapState = (state: ReduxState) => {
  return {
    show: state.navigation.show,
  };
};

const mapDispatch = {
  toggleNavigation,
};

export default connect(mapState, mapDispatch)(Navigation);
