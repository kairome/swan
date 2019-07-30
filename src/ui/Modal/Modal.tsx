import React from 'react';

import s from './Modal.css';

interface Props {
  children: React.ReactNode;
  show: boolean;
  toggle: () => void;
}

const Modal = (props: Props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div className={s.modalContainer}>
      <div className={s.modalCover} onClick={props.toggle} />
      <div />
      <div className={s.modalBody}>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
