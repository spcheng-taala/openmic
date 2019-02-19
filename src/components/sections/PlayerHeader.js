import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import CircularImage from '../ui/CircularImage.js'
import Branding from '../ui/Branding.js';
import FooterText from '../ui/FooterText.js';
import Title from '../ui/Title.js';
import Subtitle from '../ui/Subtitle.js';

const divStyle = {
  marginBottom: 50,
}

class PlayerHeader extends Component {
	render() {
		return (
			<Container>
        <Row style={divStyle}>
          <Col lg={12}>
            <Title title={this.props.player.first_name + " " + this.props.player.last_name}/>
            <Subtitle subtitle={"Position: " + this.props.player.position.toUpperCase()}/>
            <Subtitle subtitle={"Height: " + this.props.player.height}/>
            <Subtitle subtitle={"Weight: " + this.props.player.weight}/>
          </Col>
        </Row>
			</Container>
		)
	}
}

export default PlayerHeader;
