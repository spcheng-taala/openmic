import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import UserManager from '../../../singletons/UserManager.js';
import BackendManager from '../../../singletons/BackendManager.js';

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

const termsStyle = {
  textSize: 14,
  color: "grey",
  font: "Lato",
  textAlign: "center",
}

const bigAvatar = {
  marginTop: 20,
  width: 100,
  height: 100,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
}

const containerStyle = {
  overflow: 'scroll',
}

class SignUpModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      username: "",
      validUsername: false,
    }

    this.signUpHandler = this.signUpHandler.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.renderSignUpButton = this.renderSignUpButton.bind(this);
  }

  signUpHandler() {
    BackendManager.makeQuery('users/create/email', JSON.stringify({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
      profile_picture: "https://s3-us-west-2.amazonaws.com/pokadotmedia/default_profile_picture.png",
    }))
    .then(data => {
      UserManager.id = data.id;
      UserManager.firstName = data.first_name;
      UserManager.lastName = data.last_name;
      UserManager.email = data.email;
      UserManager.username = data.username;
      UserManager.profilePicture = data.profile_picture;
      BackendManager.token = data.token;
      var date = new Date();
      date.setSeconds(date.getSeconds() + data.expires_in);
      var cachedData = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        profile_picture: data.profile_picture,
        email: data.email,
        token: data.token,
        refresh_token: data.refresh_token,
        expiration: date,
      }
      localStorage.setItem('user', cachedData);
      if (UserManager.id > 0) {
        this.props.closeModal();
        this.props.handleAuth();
        this.props.history.push('/edit');
      }
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

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
    BackendManager.makeQuery('users/check/username', JSON.stringify({
      username: this.state.username,
    }))
    .then(data => {
      this.setState({validUsername: data.success});
    });
  }

  renderSignUpButton() {
    if (this.state.validUsername) {
      return (
        <button className='button-rounded' onClick={() => this.signUpHandler()}>Sign Up</button>
      )
    }
  }

  render() {
		return (
      <div>
        <h2 style={titleStyle}>Sign up and start sharing your stories!</h2>
        <div>
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
            label="Username"
            floatingLabelText="Email"
            style={textFieldStyle}
            fullWidth
            value={this.state.username}
            onChange={this.handleUsernameChange}/>
          <TextField
            label="Password"
            floatingLabelText="Password"
            style={textFieldStyle}
            type="password"
            fullWidth
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </div>
        {this.renderSignUpButton()}
        <p style={termsStyle}>{"By clicking Sign Up you agree to our Terms of Service"}</p>
      </div>
    )
  }
}

export default withRouter(SignUpModal);
