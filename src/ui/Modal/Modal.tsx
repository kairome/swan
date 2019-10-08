import React from 'react';

import Transition from 'ui/Transition/Transition';

import s from './Modal.css';

interface Props {
  children: React.ReactNode,
  show: boolean,
  footer: React.ReactNode,
  toggle?: () => void,
  className?: string,
  title?: string,
}

const Modal = (props: Props) => {
  const renderHeader = () => {
    const { title } = props;

    if (!title) {
      return null;
    }

    return (
      <div className={s.modalTitle}>
        {title}
      </div>
    );
  };

  const { className } = props;
  const bodyClasses = className ? `${s.modalBody} ${className}` : s.modalBody;
  return (
    <Transition
      show={props.show}
      duration={150}
      passThrough
    >
      <div className={s.modalContainer}>
        <div className={s.modalCover} onClick={props.toggle} />
        <div />
        <Transition
          enter={s.modalActive}
          exit={s.modalDone}
          show={props.show}
          duration={150}
        >
          <div className={bodyClasses}>
            {renderHeader()}
            <div>{props.children}</div>
            <div className={s.modalFooter}>{props.footer}</div>
          </div>
        </Transition>
      </div>
    </Transition>
  );
};

export default Modal;
