import React from 'react';
import './App.sass';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Example from './components/Example/Example';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <Example prop1 prop2="property" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
