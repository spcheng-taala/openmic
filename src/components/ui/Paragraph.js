import React, { Component } from 'react';

class Paragraph extends Component {
  render() {
    return (
      <div>
        <p className="paragraph">{this.props.paragraph}</p>
      </div>
    )
  }
}

export default Paragraph;
