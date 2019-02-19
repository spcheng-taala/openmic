import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Container, Row } from 'react-grid-system';

import CallToAction from './CallToAction.js';

class Header extends Component {
  render() {
    return (
      <section>
        <Container>
          <Row>
            <CallToAction title={this.props.title}
              subtitle={this.props.subtitle}
            />
          </Row>
        </Container>
      </section>
    )
  }
}

export default Header;
