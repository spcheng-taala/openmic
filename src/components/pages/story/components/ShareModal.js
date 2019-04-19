import React, { Component } from 'react';
import Modal from 'react-modal';
import TwitterLogin from './TwitterLogin.js';

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}

class ShareModal extends Component {
  constructor(props) {
    super(props);

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  onSuccess(response) {
    response.json().then(body => {
      localStorage.setItem('oauth_token', body.data.oauth_token);
      localStorage.setItem('oauth_token_secret', body.data.oauth_token_secret);
      localStorage.setItem('screen_name', body.data.screen_name);
      if (this.props.clip) {
        localStorage.setItem('clip_url', this.props.clip.url);
        localStorage.setItem('clip_title', this.props.clip_title);
      }
      window.open('/share/t');
    });
  }

  onFailure(error) {

    alert(error);
  }

  render() {
		return (
      <div>
        <TwitterLogin
          loginUrl="http://localhost:8080/pp/auth/twitter"
          onFailure={this.onFailure}
          onSuccess={this.onSuccess}
          requestTokenUrl="http://localhost:8080/pp/auth/twitter/reverse"
        />
      </div>
    )
  }
}

export default ShareModal;
