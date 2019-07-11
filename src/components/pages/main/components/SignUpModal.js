import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import UserManager from '../../../singletons/UserManager.js';
import BackendManager from '../../../singletons/BackendManager.js';

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: 'Lato',
    color: '#222225',
  },
  textFieldLabelRoot: {
    fontFamily: 'Lato',
  }
});

const textFieldStyle = {
  marginTop: 10,
}

const titleStyle = {
  color: '#222225',
  textAlign: 'center',
}

const termsStyle = {
  textSize: 14,
  color: 'grey',
  textAlign: 'center',
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
    var profPicNumber = (Math.floor(Math.random() * 7)) + 1;
    var profilePicture = "https://riptide-defaults.s3-us-west-2.amazonaws.com/default_profile_picture_" + profPicNumber + ".png";
    BackendManager.makeQuery('users/create/email', JSON.stringify({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
      profile_picture: profilePicture,
    }))
    .then(data => {
      if (data.success) {
        UserManager.id = data.id;
        UserManager.firstName = data.first_name;
        UserManager.lastName = data.last_name;
        UserManager.email = data.email;
        UserManager.username = data.username;
        UserManager.profilePicture = data.profile_picture;
        BackendManager.token = data.token;
        BackendManager.refreshToken = data.refresh_token;
        var date = new Date();
        date.setSeconds(date.getSeconds() + data.expires_in);
        localStorage.setItem('id', data.id);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('last_name', data.last_name);
        localStorage.setItem('email', data.email);
        localStorage.setItem('username', data.username);
        localStorage.setItem('profile_picture', data.profile_picture);
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('expiration', date);
        localStorage.setItem('bio', "Nothing here yet!");
        this.props.closeModal();
        this.props.setProfilePicture(data.profile_picture);
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
    if (!(/\s/.test(e.target.value))) {
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
  }

  renderSignUpButton() {
    if (this.state.validUsername && this.state.firstName != "" && this.state.lastName != "" && this.state.email != "" && this.state.password != "") {
      return (
        <button className='button-rounded' onClick={() => this.signUpHandler()}>Sign Up</button>
      )
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        <h2 style={titleStyle}>{"Join Riptide today"}</h2>
        <div>
          <TextField label="First Name"
            floatingLabelText="First Name"
            style={textFieldStyle}
            fullWidth
            value={this.state.firstName}
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
            onChange={this.handleFirstNameChange}/>
          <TextField
            label="Last Name"
            floatingLabelText="Last Name"
            style={textFieldStyle}
            fullWidth
            value={this.state.lastName}
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
            onChange={this.handleLastNameChange}/>
          <TextField
            label="Email"
            floatingLabelText="Email"
            style={textFieldStyle}
            fullWidth
            value={this.state.email}
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
            onChange={this.handleEmailChange}/>
          <TextField
            label="Username"
            floatingLabelText="Email"
            style={textFieldStyle}
            fullWidth
            value={this.state.username}
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
            onChange={this.handleUsernameChange}/>
          <TextField
            label="Password"
            floatingLabelText="Password"
            style={textFieldStyle}
            type="password"
            fullWidth
            value={this.state.password}
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
            onChange={this.handlePasswordChange}
          />
        </div>
        {this.renderSignUpButton()}
        <p style={termsStyle}>By clicking Sign Up you have indicated that you have read and agreed to our <a href="localhost:3000/terms" onClick={() => window.open(UserManager.domain + 'terms', "_blank")}>Terms of Service</a> and <a href="https://riptide.fm/terms" onClick={() => window.open(UserManager.domain + 'privacy', "_blank")}>Privacy Policy</a></p>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(SignUpModal));
