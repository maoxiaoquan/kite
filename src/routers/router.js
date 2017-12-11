import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Index from '../containers/Index/view';
import List from '../containers/List';
import About from '../containers/About';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/list" component={List} />
            <Route path="/about" component={About} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
