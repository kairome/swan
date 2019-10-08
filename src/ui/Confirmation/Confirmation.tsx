import React from 'react';

// components
import Modal from 'ui/Modal/Modal';
import Button from 'ui/Button/Button';


import s from './Confirmation.css';

interface Props {
  show: boolean,
  toggle: () => void,
  message: string,
  confirm: () => void,
  children?: React.ReactNode,
}

const Confirmation: React.FC<Props> = (props) => {
  const renderFooter = () => (
    <React.Fragment>
      <Button
        text="Cancel"
        theme="danger"
        shape="text"
        onClick={props.toggle}
        className={s.cancelBtn}
      />
      <Button
        text="Confirm"
        theme="primary"
        shape="text"
        onClick={props.confirm}
        className={s.confirmBtn}
      />
    </React.Fragment>
  );

  return (
    <Modal
      show={props.show}
      toggle={props.toggle}
      footer={renderFooter()}
    >
      <div>
        {props.message}
        {props.children}
      </div>
    </Modal>
  );
};

export default Confirmation;
