import React, { Component } from 'react';
import { Col } from 'react-grid-system';

class CircularImage extends Component {
  render() {
    return (
      <Col lg={6}>
        <img className="circular-image" src={this.props.image} />
      </Col>
    )
  }
}

export default CircularImage;
