import React from 'react';
import { connect } from 'react-redux';
import { clearToastr } from 'actions/toastr';
import { ReduxState } from 'types/redux';
import _ from 'lodash';

import ToastrMessage from 'ui/Toastr/ToastrMessage';
import s from './Toastr.css';

type MapState = ReturnType<typeof mapState>;
type MapDispatch = typeof mapDispatch;
type Props = MapState & MapDispatch;

const Toastr: React.FC<Props> = (props) => {
  const { toastrs } = props;
  if (_.isEmpty(toastrs)) {
    return null;
  }

  const handleClear = (id: string) => {
    props.clearToastr(id);
  };

  const list = _.map(toastrs, toastr => (
    <ToastrMessage
      key={toastr.id}
      toastr={toastr}
      clear={handleClear}
    />
  ));

  return (
    <div className={s.toastrWrapper}>
      {list}
    </div>
  );
};

const mapState = (state: ReduxState) => ({
  toastrs: state.toastr.toastrs,
});

const mapDispatch = {
  clearToastr,
};

export default connect(mapState, mapDispatch)(Toastr);
