import React from 'react';
import {Elements} from 'react-stripe-elements';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';
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

class CheckoutModal extends React.Component {

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
    this.createDonation = this.createDonation.bind(this);
  }

  getToken() {
    var fields = this.state.expiry.split("/");
    var month = parseInt(fields[0]);
    var year = 2000 + parseInt(fields[1].replace(/\s/g, ''));
    console.log(month);
    console.log(year);
    BackendManager.makeQuery('charges/token', JSON.stringify({
      number: this.state.number,
      month: month,
      year: year,
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
      BackendManager.makeQuery('charges/charge', JSON.stringify({
        amount: this.props.amount * 100,
        token: token,
        description: this.props.currentStory.user_id,
      }))
      .then(data => {
        if (data.success) {
          this.createDonation();
        }
      });
    } else {
      BackendManager.makeQuery('charges/charge/account', JSON.stringify({
        amount: this.props.amount * 100,
        token: token,
        account: this.props.account,
      }))
      .then(data => {
        if (data.success) {
          this.createDonation();
        }
      });
    }
  }

  createDonation() {
    if (this.props.donateType == "dm") {
      if (this.props.isLoggedIn) {
        BackendManager.makeQuery('donations/create', JSON.stringify({
          amount: this.props.amount * 100,
          user_id: this.props.currentStory.user_id,
          supporter_id: UserManager.id,
          supporter_name: UserManager.firstName + " " + UserManager.lastName,
          story_id: this.props.currentStory.id,
        }))
        .then(data => {
          if (data.success) {
            this.props.showToast("Thanks!");
            this.props.finishCheckoutModal();
          }
        });
      } else {
        BackendManager.makeQuery('donations/create/noaccount', JSON.stringify({
          amount: this.props.amount * 100,
          user_id: this.props.currentStory.user_id,
          supporter_name: this.props.name,
          story_id: this.props.currentStory.id,
        }))
        .then(data => {
          if (data.success) {
            this.props.showToast("Thanks!");
            this.props.finishCheckoutModal();
          }
        });
      }
    } else {
      if (this.props.isLoggedIn) {
        BackendManager.makeQuery('public/comments/create', JSON.stringify({
          donation: this.props.amount * 100,
          story_id: this.props.currentStory.id,
          name: UserManager.firstName + " " + UserManager.lastName,
          email: UserManager.email,
          comment: this.props.comment,
          title: this.props.currentStory.title,
        }))
        .then(data => {
          if (data.success) {
            this.props.showToast("Sent!");
            this.props.fetchComments(this.props.currentStory.id);
            this.props.finishCheckoutModal();
          }
        });
      } else {
        BackendManager.makeQuery('public/comments/create', JSON.stringify({
          donation: this.props.amount * 100,
          story_id: this.props.currentStory.id,
          name: this.props.name,
          email: this.props.email,
          comment: this.props.comment,
          title: this.props.currentStory.title,
        }))
        .then(data => {
          if (data.success) {
            this.props.showToast("Sent!");
            this.props.fetchComments(this.props.currentStory.id);
            this.props.finishCheckoutModal();
          }
        });
      }
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

export default CheckoutModal;
