import React, { Component } from 'react';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
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

class ConfirmEmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleSendClick() {
    if (this.props.commentType == "comment") {
      BackendManager.makeQuery('public/comments/create', JSON.stringify({
        donation: 0,
        story_id: this.props.currentStory.id,
        name: this.state.name,
        email: this.state.email,
        comment: this.props.comment,
        title: this.props.currentStory.title,
      }))
      .then(data => {
        if (data.success) {
          this.props.fetchComments(this.props.currentStory.id);
          this.props.finishConfirmEmailModal();
        }
      });
    } else {
      BackendManager.makeQuery('public/comments/reply', JSON.stringify({
        donation: 0,
        story_id: this.props.currentStory.id,
        name: this.state.name,
        email: this.state.email,
        comment: this.props.comment,
        title: this.props.currentStory.title,
        parent_comment_id: this.props.parentCommentId,
        parent_email: this.props.parentEmail,
      }))
      .then(data => {
        if (data.success) {
          this.props.fetchComments(this.props.currentStory.id);
          this.props.finishConfirmEmailModal();
        }
      });
    }
  }

  render() {
		return (
      <div>
        <h2 style={titleStyle}>{"Enter your email so we can alert you when they respond!"}</h2>
        <div>
          <TextField
            label="Name"
            floatingLabelText="Name"
            fullWidth
            style={textFieldStyle}
            value={this.state.name}
            onChange={this.handleNameChange} />
        </div>
        <div>
          <TextField
            label="Email"
            floatingLabelText="Email"
            fullWidth
            style={textFieldStyle}
            value={this.state.email}
            onChange={this.handleEmailChange} />
        </div>
        <button className='button-rounded' onClick={() => this.handleSendClick()}>
          {"Send"}
        </button>
      </div>
    )
  }
}

export default ConfirmEmailModal;
