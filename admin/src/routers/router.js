import React, { PureComponent, Fragment } from 'react'
import {
  Route,
  Redirect,
  HashRouter,
  browserHistory
} from 'react-router-dom'

import routerConfig from '../config/router.config'

import Loadable from 'react-loadable'

const LoadingComponent = ({isLoading, error}) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>
  }
  else {
    return null
  }
}
class RouteConfig extends PureComponent {

  render () {
    return (
      <HashRouter history={browserHistory}>
        <Fragment>
          {
            routerConfig.map((item, key) => {
              return (
                !item.routes ?
                  <Route
                    component={
                      Loadable({
                        loader: item.component,
                        loading: LoadingComponent
                      })}
                    key={key}
                    path={item.path}
                  />
                  :
                  <Route render={() =>
                    <item.component>
                      {
                        item.routes.map((children_item, children_key) => {
                          return (
                            <Route
                              component={
                                Loadable({
                                  loader: children_item.component,
                                  loading: LoadingComponent
                                })}
                              key={children_key}
                              path={children_item.path}
                            />
                          )
                        })
                      }
                    </item.component>
                  } key={key} path={item.path}/>
              )
            })
          }
          <Route
            exact
            path="/"
            render={() => <Redirect to="/manager/index"/>}
          />
        </Fragment>
      </HashRouter>
    )
  }
}

export default RouteConfig
