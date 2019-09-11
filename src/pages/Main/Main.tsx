import React from 'react';

import Interactive from 'ui/Interactive/Interactive';
import Toastr from 'ui/Toastr/Toastr';
import routes from './routes';

import s from './Main.css';

const Main = () => (
  <div className={s.mainPage}>
    <div className={s.content}>
      {routes}
    </div>
    <Interactive />
    <Toastr />
  </div>
);

export default Main;
