// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import { Container, Row, Col } from 'react-grid-system';
import AddressSection from './AddressSection';
import CardSection from './CardSection';
import GemQuantity from './GemQuantity';

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
    }
  }

  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createPaymentMethod knows from which Element to
    // create the PaymentMethod, since there's only one in this group.
    // See our createPaymentMethod documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method
    this.props.stripe
      .createPaymentMethod('card', {billing_details: {name: 'Jenny Rosen'}})
      .then(({paymentMethod}) => {
        console.log('Received Stripe PaymentMethod:', paymentMethod);
      });

    // You can also use handleCardPayment with the Payment Intents API automatic confirmation flow.
    // See our handleCardPayment documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-payment

    // this.props.stripe.handleCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', data);

    // You can also use createToken to create tokens.
    // See our tokens documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-token

    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // token type can optionally be inferred if there is only one one Element
    // with which to create tokens
    // this.props.stripe.createToken({name: 'Jenny Rosen'});

    // You can also use createSource to create Sources.
    // See our Sources documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-source

    // this.props.stripe.createSource({
    //   type: 'card',
    //   owner: {
    //     name: 'Jenny Rosen',
    //   },
    // });
  };

  render() {
    return (
      <div>
        <form className='co-form' style={{marginTop: 20, marginLeft: 20, marginRight: 20}}>
          <CardSection />
        </form>
        <form className='co-form' style={{margin: 20}}>
          <Row>
            <Col>
              <AddressSection />
              <button className="co-button">Confirm order</button>
            </Col>
            <Col>
              <GemQuantity id={this.state.id} price={this.state.price} quantity={this.state.quantity}/>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
