// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import { Container, Row, Col } from 'react-grid-system';
import AddressSection from './AddressSection';
import CardSection from './CardSection';
import GemQuantity from './GemQuantity';
import BackendManager from '../../../singletons/BackendManager.js';

class CheckoutForm extends React.Component {

  componentWillMount() {
    var id = localStorage.getItem('gem_id');
    var quantity = localStorage.getItem('gem_quantity');
    var price = localStorage.getItem('gem_price');
    this.setState({
      id: id,
      quantity: quantity,
      price: price,
    });

    localStorage.removeItem('gem_id');
    localStorage.removeItem('gem_quantity');
    localStorage.removeItem('gem_price');
  }

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      quantity: 0,
      price: 0,
      multiple: 1,
      name: "",
      email: "",
      street: "",
      cell: "",
      city: "",
      state: "",
    }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleStreetChange = this.handleStreetChange.bind(this);
    this.handleCellChange = this.handleCellChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
  }

  handleNameChange(name) {
    this.setState({
      name: name,
    });
  }

  handleEmailChange(email) {
    this.setState({
      email: email,
    });
  }

  handleStreetChange(street) {
    this.setState({
      street: street,
    });
  }

  handleCellChange(cell) {
    this.setState({
      cell: cell,
    });
  }

  handleCityChange(city) {
    this.setState({
      city: city,
    });
  }

  handleStateChange(state) {
    this.setState({
      state: state,
    });
  }

  confirmOrder() {
    var description = {
      "name": this.state.name,
      "email": this.state.email,
      "street": this.state.street,
      "cell": this.state.cell,
      "city": this.state.city,
      "state": this.state.state,
    }

    this.props.stripe.createToken({name: "Name"})
    .then(({token}) => {
      console.log(token);
      BackendManager.makeQuery('payments/charge', JSON.stringify({
        amount: this.state.price * this.state.multiple,
        token: token.id,
        description: JSON.stringify(description),
      }))
      .then(data => {
        if (data.success) {
          this.setState({token: data.success});
        }
      });
    });
  }

  // handleSubmit = (ev) => {
  //   // We don't want to let default form submission happen here, which would refresh the page.
  //   ev.preventDefault();
  //
  //   // Within the context of `Elements`, this call to createPaymentMethod knows from which Element to
  //   // create the PaymentMethod, since there's only one in this group.
  //   // See our createPaymentMethod documentation for more:
  //   // https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method
  //   // this.props.stripe
  //   //   .createPaymentMethod('card', {billing_details: {name: this.state.name}})
  //   //   .then(({paymentMethod}) => {
  //   //     console.log('Received Stripe PaymentMethod:', paymentMethod);
  //   //
  //   //   });
  //
  //   var description = {
  //     "name": this.state.name,
  //     "email": this.state.email,
  //     "street": this.state.street,
  //     "cell": this.state.cell,
  //     "city": this.state.city,
  //     "state": this.state.state,
  //   }
  //
  //   this.props.stripe.createToken({name: "Name"})
  //   .then(({token}) => {
  //     console.log(token);
  //     // BackendManager.makeQuery('payments/charge', JSON.stringify({
  //     //   amount: this.state.price * this.state.multiple,
  //     //   token: token.id,
  //     //   description: JSON.stringify(description),
  //     // }))
  //     // .then(data => {
  //     //   if (data.success) {
  //     //     this.setState({token: data.success});
  //     //   }
  //     // });
  //   });
  //
  //   // You can also use handleCardPayment with the Payment Intents API automatic confirmation flow.
  //   // See our handleCardPayment documentation for more:
  //   // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-payment
  //
  //   // this.props.stripe.handleCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', data);
  //
  //   // You can also use createToken to create tokens.
  //   // See our tokens documentation for more:
  //   // https://stripe.com/docs/stripe-js/reference#stripe-create-token
  //
  //   // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  //
  //   // token type can optionally be inferred if there is only one one Element
  //   // with which to create tokens
  //   // this.props.stripe.createToken({name: 'Jenny Rosen'});
  //
  //   // You can also use createSource to create Sources.
  //   // See our Sources documentation for more:
  //   // https://stripe.com/docs/stripe-js/reference#stripe-create-source
  //
  //   // this.props.stripe.createSource({
  //   //   type: 'card',
  //   //   owner: {
  //   //     name: 'Jenny Rosen',
  //   //   },
  //   // });
  // };

  render() {
    return (
      <div>
        <div className='co-form' style={{marginTop: 20, marginLeft: 20, marginRight: 20}}>
          <CardSection />
        </div>
        <div className='co-form' style={{margin: 20}}>
          <Row>
            <Col>
              <AddressSection
                handleNameChange={this.handleNameChange}
                handleEmailChange={this.handleEmailChange}
                handleStreetChange={this.handleStreetChange}
                handleCellChange={this.handleCellChange}
                handleCityChange={this.handleCityChange}
                handleStateChange={this.handleStateChange}/>
              <button className="co-button" onClick={() => this.confirmOrder()}>Confirm order</button>
            </Col>
            <Col>
              <GemQuantity id={this.state.id} price={this.state.price} quantity={this.state.quantity}/>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
