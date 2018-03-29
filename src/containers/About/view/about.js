import React, { Component } from 'react';
import { connect } from 'react-redux';

import './about.scss';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: '刷新'
    };
  }
  click() {
    console.log(this.props);
  }

  render() {
    const { list } = this.props;
    return (
      <div className="list">
        {/*  {
          list.list.map((item, key) => (
            <div className="list-li" key={key}>{item}</div>
          ))
        } */}
        <div>
          99{this.state.one}
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  console.log('state', state);
  return {
    state,
  };
})(List);
