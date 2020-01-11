import React from 'react';
import './App.sass';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Lobby from './components/Lobby';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <Lobby />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
