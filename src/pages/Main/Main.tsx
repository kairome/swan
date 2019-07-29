import React from 'react';

import routes from './routes';
import Interactive from 'ui/Interactive/Interactive';

import s from './Main.css';


const Main = () => {
  return (
    <div className={s.mainPage}>
      <div className={s.content}>
        {routes}
      </div>
      <Interactive />
    </div>
  );
};

export default Main;
