import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class DarkTitle extends Component {
  render() {
    return (
      <div>
        <h1 className="title-dark">{this.props.title}</h1>
      </div>
    )
  }
}

export default DarkTitle;
