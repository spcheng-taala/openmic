import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col } from 'react-grid-system';
import Title from './Title.js';
import Subtitle from './Subtitle.js';

class CallToAction extends Component {
  render() {
    return (
      <Col lg={12}>
        <Title title={this.props.title}/>
        <Subtitle subtitle={this.props.subtitle}/>
      </Col>
    )
  }
}

export default CallToAction;
