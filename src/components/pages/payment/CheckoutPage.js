import React from 'react';
import {Elements} from 'react-stripe-elements';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import CreditCardInput from 'react-credit-card-input';

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class CheckoutPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      number: "",
      cvc: "",
      expiry: "",
      month: 1,
      year: 2019
    }

    this.getToken = this.getToken.bind(this);
    this.charge = this.charge.bind(this);
    this.handleCardNumberChange = this.handleCardNumberChange.bind(this);
    this.handleCardExpiryChange = this.handleCardExpiryChange.bind(this);
    this.handleCardCVCChange = this.handleCardCVCChange.bind(this);
  }

  getToken() {
    var fields = this.state.expiry.split("/");
    var month = parseInt(fields[0]);
    var year = parseInt(("20" + fields[1]));
    BackendManager.makeQuery('payments/token', JSON.stringify({
      number: this.state.number,
      exp_month: month,
      exp_year: year,
      cvc: this.state.cvc,
    }))
    .then(data => {
      if (data.success) {
        this.charge(data.token);
      }
    });
  }

  charge(token) {
    if (this.props.account == "0") {
      BackendManager.makeQuery('payments/charge', JSON.stringify({
        amount: this.props.amount,
        token: token,
        description: this.props.userId,
      }))
      .then(data => {
        if (data.success) {
          this.setState({token: data.success});
        }
      });
    } else {
      BackendManager.makeQuery('payments/charge/account', JSON.stringify({
        amount: this.props.amount,
        token: token,
        account: this.props.account,
      }))
      .then(data => {
        if (data.success) {
          this.setState({token: data.success});
        }
      });
    }
  }

  handleCardNumberChange(e) {
    this.setState({
      number: e.target.value,
    });
  }

  handleCardExpiryChange(e) {
    this.setState({
      expiry: e.target.value,
    });
  }

  handleCardCVCChange(e) {
    this.setState({
      cvc: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <CreditCardInput
          cardNumberInputProps={{ value: this.state.number, onChange: this.handleCardNumberChange }}
          cardExpiryInputProps={{ value: this.state.expiry, onChange: this.handleCardExpiryChange }}
          cardCVCInputProps={{ value: this.state.cvc, onChange: this.handleCardCVCChange }}
          fieldClassName="input"
        />
        <button className='button-rounded' onClick={() => this.getToken()}>
          Done!
        </button>
      </div>
    );
  }
}

export default CheckoutPage;
