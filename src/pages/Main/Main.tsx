import React from 'react';

import Interactive from 'ui/Interactive/Interactive';
import routes from './routes';

import s from './Main.css';


const Main = () => (
  <div className={s.mainPage}>
    <div className={s.content}>
      {routes}
    </div>
    <Interactive />
  </div>
);

export default Main;
