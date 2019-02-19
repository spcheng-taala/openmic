import React, { Component } from 'react';
import Modal from 'react-modal';
import { Container, Row, Col } from 'react-grid-system';
import classNames from 'classnames';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';

const smallSvgStyle = {
  width: 60,
  height: 60,
}

const textFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
}

const titleStyle = {
  color: "#E1BE62",
  font: "Lato",
}

const textStyle = {
  color: "#222225",
  font: "Lato",
  fontSize: 20,
}

const smallTextStyle = {
  color: "grey",
  font: "Lato",
  fontSize: 17,
}

const errorStyle = {
  color: "#D14D85",
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const textFieldMargin = {
  marginRight: 'right',
}

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 'auto',
  },
  margin: {
    margin: 50,
  },
  textField: {
    flexBasis: 200,
  },
});

class GoldCommentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      amount: 0.50,
      isBadNumber: false,
      email: "",
      name: "",
    }

    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSendNoteClick = this.handleSendNoteClick.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.renderBadNumberError = this.renderBadNumberError.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.renderName = this.renderName.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleCommentChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleAmountChange(e) {
    var regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    var value = 0;
    if (e.target.value != '') {
      value = e.target.value;
    }
    this.setState({
      amount: e.target.value,
      isBadNumber: !regex.test(value),
    });
  }

  handleSendNoteClick() {
    if (!this.props.isLoggedIn) {
      if (this.state.email == "") {
        alert("Don't forget to enter an email!");
      } else {
        this.props.sendNote(this.state.note, this.state.email, this.state.name);
        this.props.closeDonateModal();
      }
    } else {
      this.props.sendNote(this.state.note, UserManager.email, this.state.name);
      this.props.closeDonateModal();
    }
  }

  handleDoneClick() {
    this.props.setDonation(this.state.amount);
    this.props.setDonationComment(this.state.comment);
    if (!this.props.isLoggedIn) {
      this.props.setDonationEmail(this.state.email);
      this.props.setDonationName(this.state.name);
    }
    this.props.openCheckoutModal();
  }

  renderBadNumberError() {
    if (this.state.isBadNumber) {
      return (
        <p style={errorStyle}>Oops! Make sure you enter a valid number!</p>
      );
    }
  }

  renderEmail() {
    if (!this.props.isLoggedIn) {
      const classes = useStyles();
      return (
        <TextField
          label="Enter your email so we can alert you when they respond"
          className={classNames(classes.margin, classes.textField)}
          id="outlined-adornment-amount"
          placeholder="Email"
          fullWidth
          style={textFieldStyle}
          value={this.state.email}
          onChange={this.handleEmailChange} />
      );
    }
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  renderName() {
    if (!this.props.isLoggedIn) {
      const classes = useStyles();
      return (
        <TextField
          label="Name"
          className={classNames(classes.margin, classes.textField)}
          id="outlined-adornment-amount"
          placeholder="Name"
          fullWidth
          style={textFieldStyle}
          value={this.state.name}
          onChange={this.handleNameChange} />
      );
    }
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  render() {
    const classes = useStyles();

		return (
      <div>
        <h2 style={titleStyle}>{"Go Gold and award a donation to the Creator!"}</h2>
        <Row>
          <img style={smallSvgStyle} src={"./images/coin2.svg"}/>
          <img style={smallSvgStyle} src={"./images/coin1.svg"}/>
          <img style={smallSvgStyle} src={"./images/coin3.svg"}/>
          <img style={smallSvgStyle} src={"./images/ruby.svg"}/>        
        </Row>
        <p style={textStyle}>{"Benefits of Going Gold:"}</p>
        <p style={smallTextStyle}>{"Helps give the Creator resources to produce more awesome content."}</p>
        <p style={smallTextStyle}>{"Creators notice and respond to Gold comments faster."}</p>
        <TextField
          id="outlined-adornment-amount"
          className={classNames(classes.margin, classes.textField)}
          style={textFieldMargin}
          variant="outlined"
          label="Amount"
          value={this.state.amount}
          type="number"
          fullWidth
          inputProps={{ min: 0.25 }}
          onChange={this.handleAmountChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        {this.renderBadNumberError()}
        <TextField
          id="outlined-adornment-amount"
          label="Comment"
          multiline
          fullWidth
          rows="4"
          className={classNames(classes.margin, classes.textField)}
          onChange={this.handleCommentChange}
          margin="normal"
          variant="outlined"
        />
        {this.renderEmail()}
        {this.renderName()}
        <button className='button-rounded' onClick={() => this.handleDoneClick()}>
          {"Post"}
        </button>
      </div>
    )
  }
}

export default withStyles(useStyles)(GoldCommentModal);
