import React from 'react';
import Modal from 'ui/Modal/Modal';
import Button from 'ui/Button/Button';

import s from './Confirmation.css';

interface Props {
  show: boolean,
  toggle: () => void,
  message: string,
  confirm: () => void,
}

const Confirmation: React.FC<Props> = (props) => {
  return (
    <Modal
      show={props.show}
      toggle={props.toggle}
    >
      <div>
        <div>{props.message}</div>
        <div className={s.footer}>
          <Button
            text="Confirm"
            theme="info"
            onClick={props.confirm}
            className={s.confirmBtn}
          />
          <Button
            text="Cancel"
            theme="danger"
            onClick={props.toggle}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Confirmation;
