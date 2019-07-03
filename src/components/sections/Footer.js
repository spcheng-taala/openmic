import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';

class Footer extends Component {
	render() {
		return (
      <section className="footer">
				<Container>
					<Row>
						<Col lg={12}>
							<p className="footer-text">{'© 2019 Pokadot. All Rights Reserved.'}</p>
						</Col>
					</Row>
				</Container>
      </section>
		)
	}
}

export default Footer;
