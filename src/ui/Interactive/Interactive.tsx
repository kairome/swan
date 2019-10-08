import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// actions
import { toggleNavigation } from 'actions/navigation';
import { toggleMoveNotes } from 'actions/interactive';

// components
import Button from 'ui/Button/Button';
import Transition from 'ui/Transition/Transition';

// types
import { ReduxState } from 'types/redux';

// css
import s from './Interactive.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const Interactive: React.FC<Props> = (props) => {
  const { enableMoveNotes, showSidebar } = props;

  useEffect(() => {
    if (!showSidebar && enableMoveNotes) {
      props.toggleNavigation();
    }
  }, [showSidebar, enableMoveNotes]);

  return (
    <Transition
      show={enableMoveNotes}
      duration={150}
      enter={s.coverActive}
      exit={s.coverDone}
    >
      <div className={s.interactiveCover}>
        <Transition
          show={enableMoveNotes}
          duration={150}
          enter={s.hintActive}
          exit={s.hintDone}
        >
          <div className={s.interactiveHint}>
            <div>Select a folder</div>
            <Button
              text="Cancel"
              theme="primary"
              shape="text"
              onClick={props.toggleMoveNotes}
            />
          </div>
        </Transition>
      </div>
    </Transition>
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
