import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Form from './pages/Form';

export default function Routes() {
  return (
    <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Form} />
    </Switch>
  </BrowserRouter>
  );
}