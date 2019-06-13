import React, {Component} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import MyStoreCheckout from './components/MyStoreCheckout';

class CheckOutPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gem: null,
    }
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    // User clicked submit
  }

  render() {
    return (
      <StripeProvider apiKey="pk_test_9XPRUcB7oDZHId8M1DGdZYcn">
        <MyStoreCheckout />
      </StripeProvider>
    );
  }
}

export default CheckOutPage;
