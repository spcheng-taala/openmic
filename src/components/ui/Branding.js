import React, { Component } from 'react';
import { Col } from 'react-grid-system';
import { Link } from 'react-router-dom'

class Branding extends Component {
	render() {
		return (
			<div>
				<Link to="/">
        	<img className="laptop" src="./images/logo.png" />
				</Link>
      </div>
		)
	}
}

export default Branding;
