import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

// bundle模型用来异步加载组件
import Bundle from '../Bundle';


// 同步加载
import Index from '../containers/Index/view';

// 异步加载
/*eslint-disable*/
import List from 'bundle-loader?lazy!../containers/List/view/list'; // 表单组件
import About from 'bundle-loader?lazy!../containers/About/view/about'; // 评论组件
/* eslint-enable */

// components load their module for initial visit
// //这里只是给this.props.child传一个方法，最后在Bundle的render里面调用
const createComponent = component => props => (
  <Bundle load={component}>
    {Component => <Component {...props} />}
  </Bundle>
);


class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/list" component={createComponent(List)} />
            <Route path="/about" component={createComponent(About)} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
