import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Index from '../views/Index/index';
import List from '../models/List/index';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/list" component={List} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
