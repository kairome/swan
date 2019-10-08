import React from 'react';
import { ReduxState } from 'types/redux';
import { getLoader } from 'selectors/common';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Transition from 'ui/Transition/Transition';

import s from './Toastr.css';

type MapState = ReturnType<typeof mapState>;

const SyncNotification: React.FC<MapState> = (props) => (
  <Transition
    show={props.syncLoading}
    duration={300}
    enter={s.toastrActive}
    exit={s.toastrDone}
  >
    <div className={s.syncNotification}>
      <FontAwesomeIcon icon="sync-alt" className={s.syncIcon} /> Syncing
    </div>
  </Transition>
);

const mapState = (state: ReduxState) => ({
  syncLoading: getLoader(state, 'sync'),
});

export default connect(mapState)(SyncNotification);
