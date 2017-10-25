import React, { Component } from 'react';
import { connect } from 'react-redux';

import './list.scss'

class List extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { list } = this.props
    /*   { list = [] } = list */
    return (
      <div className="list">
        {
          list.list.map((item, key) => (
            <div className="list-li" key={key}>{item}</div>
          ))
        }
      </div>
    )
  }
}

export default connect(({ list }) => {
  return {
    list: list
  }
})(List);