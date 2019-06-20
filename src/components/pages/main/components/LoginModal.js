import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from 'react-grid-system';
import TextField from '@material-ui/core/TextField';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';

const textFieldStyle = {
  color: "#222225",
  fontFamily: "Lato",
  marginTop: 10,
}

const titleStyle = {
  color: "#222225",
  fontFamily: "Lato",
  textAlign: "center",
}

const errorStyle = {
  color: "#D14D85",
  fontFamily: "Lato",
  textAlign: "left",
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
          this.props.closeModal();
          this.props.handleAuth();
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

  renderView() {
    if (this.state.isMobile) {
      return (
        <div style={{width: '60%'}}>
          <h2 style={titleStyle}>{"Login to OpenMic"}</h2>
          <div>
            <TextField
              label="Email"
              floatingLabelText="Email"
              fullWidth
              style={textFieldStyle}
              value={this.state.email}
              onChange={this.handleEmailChange} />
            <TextField
              label="Password"
              floatingLabelText="Password"
              type="password"
              fullWidth
              style={textFieldStyle}
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            {this.renderError()}
          </div>
          <button className='button-rounded' onClick={() => this.signUpHandler()}>
            Login!
          </button>
        </div>
      );
    } else {
      return (
        <div style={{width: '60%'}}>
          <Container>
            <Row>
              <Col>
                <h2 style={titleStyle}>{"Login to OpenMic"}</h2>
                <div>
                  <TextField
                    label="Email"
                    floatingLabelText="Email"
                    fullWidth
                    style={textFieldStyle}
                    value={this.state.email}
                    onChange={this.handleEmailChange} />
                  <TextField
                    label="Password"
                    floatingLabelText="Password"
                    type="password"
                    fullWidth
                    style={textFieldStyle}
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                  />
                  {this.renderError()}
                </div>
                <button className='button-rounded' onClick={() => this.signUpHandler()}>
                  Login!
                </button>
              </Col>
              <Col>
                <div style={{backgroundColor: '#3ABBBC'}}>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }

  render() {
		return (
      <div>
        {this.renderView()}
      </div>
    );
  }
}

export default withRouter(LoginModal);
