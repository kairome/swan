import React from 'react';

import s from './Modal.css';

interface Props {
  children: JSX.Element | JSX.Element[],
  show: boolean,
  toggle: () => void,
}

const Modal = (props: Props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div>
      <div className={s.modalCover} onClick={props.toggle} />
      <div>

      </div>
      <div className={s.modalBody}>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
