import React, { Component } from 'react';
import Modal from 'react-modal';
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

const textFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
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

class MessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    }

    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
  }

  handleMessageChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  handleSendClick() {
    if (this.props.receiverId != null && this.props.receiverId > 0) {
      BackendManager.makeQuery('messages/new/ids', JSON.stringify({
        sender_id: UserManager.id,
        sender_name: UserManager.firstName + " " + UserManager.lastName,
        sender_email: UserManager.email,
        receiver_id: this.props.receiverId,
        message: this.state.message,
      }))
      .then(data => {
        if (data.success) {
          this.props.closeMessageModal();
          this.props.showToast("Sent!");
        }
      });
    } else {
      BackendManager.makeQuery('messages/new/r/email', JSON.stringify({
        sender_id: UserManager.id,
        sender_name: UserManager.firstName + " " + UserManager.lastName,
        sender_email: UserManager.email,
        receiver_email: this.props.email,
        message: this.state.message,
      }))
      .then(data => {
        if (data.success) {
          this.props.closeMessageModal();
          this.props.showToast("Sent!");
        }
      });
    }
  }

  render() {
    const classes = useStyles();

		return (
      <div>
        <h2 style={titleStyle}>{"Replying to " + this.props.name}</h2>
        <TextField
          id="outlined-adornment-amount"
          label="Message"
          multiline
          fullWidth
          rows="4"
          className={classNames(classes.margin, classes.textField)}
          onChange={this.handleMessageChange}
          margin="normal"
          variant="outlined"
        />
        <button className='button-rounded' onClick={() => this.handleSendClick()}>
          {"Send"}
        </button>
      </div>
    )
  }
}

export default withStyles(useStyles)(MessageModal);
