import React from 'react';

import routes from './routes';
import s from './Main.css';


const Main = () => {
  return (
    <div className={s.mainPage}>
      <div className={s.content}>
        {routes}
      </div>
    </div>
  );
};

export default Main;
