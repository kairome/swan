import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

interface PassThroughTransition {
  show: boolean,
  passThrough: true,
  children: JSX.Element,
  duration: number,
  delay?: number,
}

interface TransitionProps {
  enter: string,
  exit: string,
  show: boolean,
  children: JSX.Element,
  duration: number,
  delay?: number,
  passThrough?: false,
}

type Props = PassThroughTransition | TransitionProps;

const Transition: React.FC<Props> = (props) => {
  const [localShow, setLocalShow] = useState(false);
  const [willUnmount, setWillUnmount] = useState(false);
  const timeout = useRef<number | null>(null);
  const { children } = props;

  const clearTransition = () => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
    }
  };

  useEffect(() => {
    if (!props.show && localShow) {
      setWillUnmount(true);
      clearTransition();
      timeout.current = window.setTimeout(() => {
        setLocalShow(false);
      }, props.duration);
    }

    if (props.show && !localShow) {
      setWillUnmount(false);
      _.delay(() => {
        setLocalShow(true);
      }, props.delay ? props.delay : 0);
    }

    return () => clearTransition();
  }, [props.show]);

  if (!localShow) {
    return null;
  }

  if (props.passThrough && localShow) {
    return children;
  }

  if (!props.passThrough) {
    const childrenClass = willUnmount ? props.exit : props.enter;
    return React.cloneElement(children, {
      className: `${children.props.className} ${childrenClass}`,
    });
  }

  return null;
};

export default Transition;
