import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Container, Row, Col } from 'react-grid-system';
import TextField from '@material-ui/core/TextField';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';

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
  fontFamily: 'Lato',
  textAlign: 'center',
}

const errorStyle = {
  color: '#D14D85',
  textAlign: 'left',
  fontSize: 17,
}

class LoginModal extends Component {

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      email: "",
      password: "",
      showError: false,
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  resize() {
    if (window.innerWidth <= 760) {
      this.setState({
        isMobile: true,
      });
    } else {
      this.setState({
        isMobile: false,
      })
    }
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

  signUpHandler() {
    console.log('here');
    BackendManager.makeQuery('users/login', JSON.stringify({
      email: this.state.email,
      password: this.state.password,
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
        localStorage.setItem('expiration', data.expiration);
        localStorage.setItem('bio', data.bio);
        if (UserManager.id > 0) {
          var sponsors = localStorage.getItem('sponsors');
          var params = [];
          if (sponsors) {
            for (var i = 0; i < sponsors.length; i++) {
              var value = {
                user_id: UserManager.id,
                story_id: sponsors[i].story_id,
                sponsor_id: sponsors[i].sponsor_id,
              };
              params.push(value);
              BackendManager.makeQuery('sponsors/update', JSON.stringify({
          			sponsors: params
          		}))
              .then(data => {
                if (data.success) {
                  localStorage.removeItem('sponsors');
                }
              });
            }
          }
          this.props.closeModal();
          this.props.handleAuth();
          this.props.showToast("Welcome back!", 'custom');
          this.props.setProfilePicture(data.profile_picture);
        }
      } else {
        this.setState({
          showError: true,
        });
      }
    })
  }

  renderError() {
    if (this.state.showError) {
      return (
        <div>
          <p style={errorStyle}>{"Oops! This email/password combination didn't work :("}</p>
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        <h2 style={titleStyle}>{"Login to Riptide"}</h2>
        <div>
          <TextField
            label="Email"
            floatingLabelText="Email"
            fullWidth
            style={textFieldStyle}
            value={this.state.email}
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
            onChange={this.handleEmailChange} />
          <TextField
            label="Password"
            floatingLabelText="Password"
            type="password"
            fullWidth
            style={textFieldStyle}
            value={this.state.password}
            InputProps={{ classes: { root: classes.textFieldInputRoot } }}
            InputLabelProps={{
              FormLabelClasses: {
                root: classes.textFieldLabelRoot
              }
            }}
            onChange={this.handlePasswordChange}
          />
          {this.renderError()}
        </div>
        <button className='button-rounded' onClick={() => this.signUpHandler()}>
          Login!
        </button>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(LoginModal));
