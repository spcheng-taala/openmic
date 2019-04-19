import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import classNames from 'classnames';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import MidTitle from '../../ui/MidTitle.js';
import Button from '../../ui/Button.js';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

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
      var token = localStorage.getItem('oauth_token');
      var secret = localStorage.getItem('oauth_token_secret');
      var handle = localStorage.getItem('screen_name');
      this.setState({
        clip: clip,
        tweet: title,
        token: token,
        secret: secret,
        handle: handle,
      });

      localStorage.removeItem('clip_url');
      localStorage.removeItem('clip_title');
      localStorage.removeItem('oauth_token');
      localStorage.removeItem('oauth_token_secret');
      localStorage.removeItem('screen_name');
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      clip: 'https://s3-us-west-2.amazonaws.com/openmic-test/1_1553896864664.mp4',
      tweet: '',
      token: '',
      secret: '',
      handle: '',
    }

    this.handleTweetChange = this.handleTweetChange.bind(this);
    this.handlePostClick = this.handlePostClick.bind(this);
  }

  handleTweetChange(e) {
    this.setState({
      tweet: e.target.value,
    });
  }

  handlePostClick() {
    BackendManager.makeQuery('tweet', JSON.stringify({
      url: this.state.clip,
      tweet: this.state.tweet,
      twitter_handle: this.state.handle,
      access_token: this.state.token,
      secret: this.state.secret,
    }))
    .then(data => {
      if (data.success) {

      }
    });
  }

  render() {
    const classes = useStyles();
		return (
      <div style={root}>
        <TextField
          id="outlined-adornment-amount"
          label="Twitter Stuff"
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
