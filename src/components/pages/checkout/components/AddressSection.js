import React from 'react';
import {CardElement} from 'react-stripe-elements';
import { Row, Col } from 'react-grid-system';

class AddressSection extends React.Component {

  render() {
    return (<div>
      <Row>
        <Col xs="6" sm="6" md="6">
          <label className="co-label">
            Name
            <input className="co-input" type="text" name="name" onChange={(e) => this.props.handleNameChange(e.target.value)} placeholder="Jane Doe" required />
          </label>
        </Col>
        <Col xs="6" sm="6" md="6">
          <label className="co-label">
            Email
            <input className="co-input" type="email" name="email" onChange={(e) => this.props.handleEmailChange(e.target.value)} placeholder="jane.doe@example.com" required />
          </label>
        </Col>
      </Row>
      <Row>
        <Col xs="6" sm="6" md="6">
          <label className="co-label">
            Address
            <input className="co-input" type="text" name="address" onChange={(e) => this.props.handleStreetChange(e.target.value)} placeholder="100 Legends Way" required />
          </label>
        </Col>
      </Row>
      <Row>
        <Col xs="5" sm="5" md="6">
          <label className="co-label">
            Cell
            <input className="co-input" type="tel" name="number" onChange={(e) => this.props.handleCellChange(e.target.value)} placeholder="781-111-1111" required />
          </label>
        </Col>
        <Col xs="4" sm="4" md="6">
          <label className="co-label">
            City
            <input className="co-input" type="text" name="city" onChange={(e) => this.props.handleCityChange(e.target.value)} placeholder="Boston" required />
          </label>
        </Col>
        <Col xs="3" sm="3" md="6">
          <label className="co-label">
            State
            <input className="co-input" type="text" name="state" onChange={(e) => this.props.handleStateChange(e.target.value)} placeholder="MA" required />
          </label>
        </Col>
      </Row>
    </div>
    );
  }
}

export default AddressSection;
