import React, { useEffect, useRef, useState } from 'react';
import { ToastrItem } from 'types/toastr';
import s from 'ui/Toastr/Toastr.css';
import classNames from 'classnames';

interface Props {
  toastr: ToastrItem,
  clear: (id: string) => void,
}

const ToastrMessage: React.FC<Props> = (props) => {
  const [willClear, setToClear] = useState(false);
  const timeOut = useRef<number | null>(null);
  const { toastr } = props;

  const resetTimeout = () => {
    if (timeOut.current !== null) {
      clearTimeout(timeOut.current);
    }
  };

  useEffect(() => {
    if (toastr.delay !== 0) {
      timeOut.current = window.setTimeout(() => {
        handleClear();
      }, toastr.delay * 1000);
    }

    return () => {
      resetTimeout();
    };
  }, [toastr]);

  const handleClear = () => {
    setToClear(true);
    resetTimeout();
    setTimeout(() => {
      props.clear(toastr.id);
    }, 300);
  };

  const classes = classNames(s.toastrItem, {
    [s.remove]: willClear,
  });

  return (
    <div className={classes} onClick={handleClear}>
      {toastr.message}
    </div>
  );
};

export default React.memo(ToastrMessage);
