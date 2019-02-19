import React, { Component } from 'react';

class Heading extends Component {
  render() {
    return (
      <div>      
        <h2 className="heading">{this.props.heading}</h2>
      </div>
    )
  }
}

export default Heading;
