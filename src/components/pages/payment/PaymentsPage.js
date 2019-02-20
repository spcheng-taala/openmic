import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import StripeCheckout from 'react-stripe-checkout';
import TextField from '@material-ui/core/TextField';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

const root = {
  margin: 50,
}

const textFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
}

 const titleStyle = {
   textAlign: 'center',
   color: '#36454f',
   fontFamily: "Lato",
   fontSize: 35,
 }

 const questionStyle = {
   color: '#36454f',
   fontFamily: "Lato",
   fontSize: 17,
   marginLeft: 20,
 }

 const answerStyle = {
   color: '#6175E0',
   fontFamily: "Lato",
   marginLeft: 50,
   marginRight: 50,
   fontSize: 20,
 }

 const descStyle = {
   textAlign: 'center',
   color: '#AAAAAA',
   fontFamily: "Lato",
   fontSize: 10,
   marginLeft: 50,
   marginRight: 50,
 }

class PaymentsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      firstName: UserManager.firstName,
      lastName: UserManager.lastName,
      email: UserManager.email,
      dob: "2017-05-24",
    }

    this.renderMainView = this.renderMainView.bind(this);
    this.changeStage = this.changeStage.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleDOBChange = this.handleDOBChange.bind(this);
    this.handlePaymentSetup = this.handlePaymentSetup.bind(this);
  }

  renderMainView() {
    if (this.state.stage == 0) {
      return (
        <div>
          <h1 style={titleStyle}>{"Activate donations and start getting paid!"}</h1>
          <h3 style={questionStyle}>{"How does it work?"}</h3>
          <h3 style={answerStyle}>{"Simple! Anytime someone listens to your work, they will have the option to send a tip as well as a note in appreciation!"}</h3>
          <h3 style={questionStyle}>{"Do you guys store my information?"}</h3>
          <h3 style={answerStyle}>{"We don't store any of your personal information"}</h3>
          <h3 style={questionStyle}>{"What percentage of my tips does OpenMic take?"}</h3>
          <h3 style={answerStyle}>{"0%! However we do use Stripe for handling transactions and they take 30 cents + 2.9% For information check out stripe.com"}</h3>
          <h3 style={questionStyle}>{"What's the catch?"}</h3>
          <h3 style={answerStyle}>{"No catch! We want to continue to help build a service that benefits our Creators. The only thing we ask is for you to continue to make awesome content and be good to your supporters!"}</h3>
          <button className='button-rounded' onClick={() => this.changeStage()}>
            {"Let's get started!"}
          </button>
        </div>
      );
    } else if (this.state.stage == 1) {
      return (
        <div style={root}>
          <h1 style={titleStyle}>{"We will need some basic information to get started"}</h1>
          <TextField label="First Name"
            floatingLabelText="First Name"
            style={textFieldStyle}
            fullWidth
            value={this.state.firstName}
            onChange={this.handleFirstNameChange}/>
          <TextField
            label="Last Name"
            floatingLabelText="Last Name"
            style={textFieldStyle}
            fullWidth
            value={this.state.lastName}
            onChange={this.handleLastNameChange}/>
          <TextField
            label="Email"
            floatingLabelText="Email"
            style={textFieldStyle}
            fullWidth
            value={this.state.email}
            onChange={this.handleEmailChange}/>
          <TextField
            id="date"
            label="Birthday"
            type="date"
            defaultValue="2017-05-24"
            style={textFieldStyle}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this.handleDOBChange}
          />
          <button className='button-rounded' onClick={this.handlePaymentSetup}>
            {"Done"}
          </button>
          <p style={descStyle}>{'We use Stripe, Inc. to handle payment transactions. By clicking "Done", you agree to both our Terms as well as the terms of Stripe.'}</p>
        </div>
      );
    }
  }

  changeStage() {
    this.setState({
      stage: 1,
    });
  }

  handleFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
  }

  handleLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleDOBChange(e) {
    this.setState({
      dob: e.target.value
    })
  }

  handlePaymentSetup() {
    var fields = this.state.dob.split('-');
    var year = fields[0];
    var month = parseInt(fields[1], 10);
    var day = parseInt(fields[2], 10);
    this.props.handlePaymentSetup(this.state.email, this.state.firstName, this.lastName, day, month, year);
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        {this.renderMainView()}
      </div>
    )
  }
}

export default PaymentsPage;
