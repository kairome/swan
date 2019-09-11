import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// actions
import { toggleNavigation } from 'actions/navigation';
import { toggleMoveNotes } from 'actions/interactive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// types
import { ReduxState } from 'types/redux';


import s from './Interactive.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const Interactive: React.FC<Props> = (props) => {
  const { enableMoveNotes, showSidebar } = props;
  if (!enableMoveNotes) {
    return null;
  }

  useEffect(() => {
    if (!showSidebar) {
      props.toggleNavigation();
    }
  }, [showSidebar]);

  return (
    <div className={s.interactiveCover} onClick={props.toggleMoveNotes}>
      <div className={s.interactiveHint}>
        <div className={s.cancel}>
          <FontAwesomeIcon icon="times" />
        </div>
        <div>Choose a folder to move notes to</div>
      </div>
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  enableMoveNotes: state.interactive.enableMoveNotes,
  showSidebar: state.navigation.show,
});

const mapDispatch = {
  toggleNavigation,
  toggleMoveNotes,
};

export default connect(mapState, mapDispatch)(Interactive);
