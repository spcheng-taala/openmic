import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import Branding from '../ui/Branding.js';
import FooterText from '../ui/FooterText.js';

class Footer extends Component {
	render() {
		return (
      <section className="footer">
				<Container>
					<Row>
						<Col lg={12}>
							<FooterText paragraph={'© 2017 Armchair GMs. All Rights Reserved.'}/>
						</Col>
					</Row>
				</Container>
      </section>
		)
	}
}

export default Footer;
