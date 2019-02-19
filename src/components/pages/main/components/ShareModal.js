import React, { Component } from 'react';
import Modal from 'react-modal';
import { withRouter } from "react-router-dom";
import { TwitterShareButton, TwitterIcon } from 'react-share';

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}

class ShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  render() {
		return (
      <div>
        <h2 style={titleStyle}>{"Share this story!"}</h2>
        <div>
          <TwitterShareButton
            url={this.props.shareUrl}
            title={this.props.title}
            className="share-button">
            <TwitterIcon
              size={32}
              round />
          </TwitterShareButton>
        </div>
      </div>
    )
  }
}

export default withRouter(ShareModal);
