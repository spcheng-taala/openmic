import React, {Component} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import MyStoreCheckout from './components/MyStoreCheckout';

class CheckOutPage extends Component {

  componentWillMount() {
    var id = localStorage.getItem('gem_id');
    if (id == null) {
      this.props.history.push('/');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      gem: null,
    }

    this.completeTransaction = this.completeTransaction.bind(this);
  }

  completeTransaction(quantity) {
    this.props.history.push('/');
    var text = "You just received " + quantity + " Gems!";
    this.props.openGemGifModal(quantity, text);
  }

  render() {
    return (
      <StripeProvider apiKey="pk_live_ggRDpKqRS1hqMFnEITD4pCXL">
        <MyStoreCheckout completeTransaction={this.completeTransaction}/>
      </StripeProvider>
    );
  }
}

export default CheckOutPage;
