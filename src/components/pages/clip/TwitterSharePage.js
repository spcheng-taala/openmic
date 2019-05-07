import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import classNames from 'classnames';
import Modal from 'react-modal';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import MidTitle from '../../ui/MidTitle.js';
import Button from '../../ui/Button.js';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import UploadingModal from './components/UploadingModal.js';

const customStyles = {
	overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(19, 18, 24, 0.75)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		background: 'rgba(255, 255, 255, 1)',
    transform: 'translate(-50%, -50%)'
  }
};

const root = {
  margin: 20,
}

const textFieldStyle = {
  color: "#222225",
  fontFamily: "Lato",
  marginTop: 10,
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
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

class TwitterSharePage extends Component {

  componentDidMount() {
    if (localStorage.getItem('clip_url') != null) {
      var clip = localStorage.getItem('clip_url');
      var title = localStorage.getItem('clip_title');
      var clipId = localStorage.getItem('clip_id');
      var token = localStorage.getItem('oauth_token');
      var secret = localStorage.getItem('oauth_token_secret');
      var handle = localStorage.getItem('screen_name');
      this.setState({
        clip: clip,
        tweet: title + ": " + "https://theopenmic.fm/clips/" + clipId,
        token: token,
        secret: secret,
        handle: handle,
      });

      localStorage.removeItem('clip_url');
      localStorage.removeItem('clip_title');
      localStorage.removeItem('clip_id');
      localStorage.removeItem('oauth_token');
      localStorage.removeItem('oauth_token_secret');
      localStorage.removeItem('screen_name');
    } else {
      // this.props.history.push('/');
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      clip: '',
      tweet: '',
      token: '',
      secret: '',
      handle: '',
      showUploadingModal: false,
    }

    this.handleTweetChange = this.handleTweetChange.bind(this);
    this.handlePostClick = this.handlePostClick.bind(this);
    this.openUploadingModal = this.openUploadingModal.bind(this);
    this.closeUploadingModal = this.closeUploadingModal.bind(this);
  }

  openUploadingModal() {
    this.setState({
      showUploadingModal: true,
    });
  }

  closeUploadingModal() {
    this.setState({
      showUploadingModal: false,
    });
  }

  handleTweetChange(e) {
    this.setState({
      tweet: e.target.value,
    });
  }

  handlePostClick() {
    this.openUploadingModal();
    BackendManager.makeQuery('tweet', JSON.stringify({
      url: this.state.clip,
      tweet: this.state.tweet,
      twitter_handle: this.state.handle,
      access_token: this.state.token,
      secret: this.state.secret,
    }))
    .then(data => {
      if (data.success) {
        console.log(data);
        this.closeUploadingModal();
        this.props.showToast("Posted!");
      }
    });
  }

  render() {
    const classes = useStyles();
		return (
      <div style={root}>
        <Modal
          isOpen={this.state.showUploadingModal}
          contentLabel="Uploading to Twitter"
          style={customStyles}
        >
          <UploadingModal/>
        </Modal>
        <TextField
          id="outlined-adornment-amount"
          label="Enter a Tweet!"
          multiline
          fullWidth
          rows="4"
          className={classNames(classes.margin, classes.textField)}
          value={this.state.tweet}
          onChange={this.handleTweetChange}
          margin="normal"
          variant="outlined"
        />
        <button className='button-rounded' onClick={() => this.handlePostClick()}>Post!</button>
      </div>
    )
  }
}

export default withStyles(useStyles)(withRouter(TwitterSharePage));
