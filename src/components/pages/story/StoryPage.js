import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import SoundPlayerItem from '../../ui/SoundPlayerItem.js';
import ProfilePage from '../profile/ProfilePage.js';
import Comments from './components/Comments.js';

// some track meta information
const trackTitle = 'Immigration and the wall';

const logoContainerStyle = {
  marginTop: -20,
  marginLeft: 30,
}

const logoContainerStyle2 = {
  marginTop: -20,
  marginLeft: 10,
}

const logoStyle = {
  width: 70,
  height: 70,
  cursor: 'pointer',
}

const storyContainerStyle = {
  position: "initial",
}

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

var listStyle = {
  paddingRight: 40,
}

var cardStyle = {
  marginBottom: 30,
}

var containerStyle = {
  marginLeft: 20,
  marginTop: 20,
  marginBottom: 300,
}

var storyImgStyle = {
  height: 200,
}

const textFieldMargin = {
  margin: 50,
}

var storyPaperStyle = {
  width: '100%',
  paddingTop: 50,
  paddingBottom: 50,
  backgroundImage: "linear-gradient(to bottom right, #42BCBB, #7E8C9B)",
}

var storyTitleStyle = {
  paddingLeft: 60,
  align: 'center',
  color: '#FFFFFF',
  fontFamily: "Lato",
  fontSize: 40,
}

var storyTextStyle = {
  paddingLeft: 60,
  align: 'center',
  color: '#FFFFFF',
  fontFamily: "Lato",
  fontSize: 30,
  textDecoration: "underline",
}

const bigAvatar = {
  width: 80,
  height: 80,
}

const mediaStyle = {
  width: '100%',
  paddingTop: 50,
  paddingBottom: 50,
  backgroundColor: '#FFFFFF'
}

const mediaTextStyle = {
  paddingLeft: 60,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 30,
}

const mediaTextStyleSmall = {
  paddingLeft: 60,
  align: 'center',
  color: 'grey',
  fontFamily: "Lato",
  fontSize: 20,
}

const dividerStyle = {
  textAlign: 'center',
}

const textFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
  marginLeft: 50,
  width: 'calc(100% - 400px)',
  marginRight: 20,
}

const mobileTextFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginLeft: 10,
  marginRight: 10,
}

const commentStyle = {
  margin: 50,
}

const playPauseButtonStyle = {
  width: 70,
  height: 70,
  paddingLeft: 60,
  marginTop: -20,
}

class StoryPage extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.props.fetchStory(this.props.match.params.id);
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

  constructor(props) {
    super(props);

    this.state = {
      seeking: false,
      playing: false,
      currentTime: 24,
      progressVal: 8,
      duration: 300,
      volume: 0.75,
      isMuted: false,
      currentStory: this.props.currentStory,
      comment: "",
      isMobile: false,
    };

    this.handleStoryClick = this.handleStoryClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.openGoldCommentModal = this.openGoldCommentModal.bind(this);
    this.openDonateModal = this.openDonateModal.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
  }

  handleStoryClick(story) {
    this.props.history.push('/story/' + story.id);
    this.props.handleStoryClick(story.id);
    this.props.playPauseSound();
  }

  handleUserClick(id, firstName, lastName, username, profilePicture) {
    this.props.history.push('/profile/' + id);
    this.props.handleUserClick(id, firstName, lastName, username, profilePicture);
  }

  handleCommentChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  openGoldCommentModal() {
    this.props.openGoldCommentModal();
  }

  openDonateModal() {
    this.props.handleDonateClick();
  }

  renderDonateTextField() {
    const classes = useStyles();
    if (this.state.tier == 1) {
      return (
        <TextField
          id="outlined-adornment-amount"
          className={classNames(classes.margin, classes.textField)}
          style={textFieldMargin}
          label="Amount"
          value={this.state.amount}
          type="number"
          inputProps={{ min: 0.50 }}
          onChange={this.handleAmountChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      );
    }
  }

  handleAmountChange(e) {
    var regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    var value = 0;
    if (e.target.value != '') {
      value = e.target.value;
    }
    this.setState({
      amount: e.target.value,
      isBadNumber: !regex.test(value),
    });
  }

  renderComments() {
    return (
      <Comments isChild={false} comments={this.props.comments} sendReply={this.sendReply}/>
    );
  }

  handleSendClick() {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('public/comments/create', JSON.stringify({
        donation: 0,
        story_id: this.props.currentStory.id,
        name: UserManager.firstName + " " + UserManager.lastName,
        email: UserManager.email,
        comment: this.state.comment,
        title: this.props.currentStory.title,
      }))
      .then(data => {
        if (data.success) {
          this.props.showToast("Sent!");
          this.props.fetchComments(this.props.currentStory.id);
          this.setState({
            comment: "",
          });
        }
      });
    } else {
      this.props.setCommentType("comment");
      this.props.openConfirmEmailModal(this.state.comment);
    }
  }

  sendReply(reply, parentCommentId, parentEmail) {
    this.props.setParentComment(parentCommentId, parentEmail);
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('public/comments/reply', JSON.stringify({
        donation: 0,
        story_id: this.props.currentStory.id,
        name: UserManager.firstName + " " + UserManager.lastName,
        email: UserManager.email,
        comment: reply,
        title: this.props.currentStory.title,
        parent_comment_id: parentCommentId,
        parent_email: parentEmail,
      }))
      .then(data => {
        if (data.success) {
          this.props.showToast("Sent!");
          this.props.fetchComments(this.props.currentStory.id);
        }
      });
    } else {
      this.props.setCommentType("reply");
      this.props.openConfirmEmailModal(reply);
    }
  }

  renderComment() {
    const classes = useStyles();
    if (this.state.isMobile) {
      return (
        <div>
          <TextField
            label="Write a comment"
            className={classNames(classes.margin, classes.textField)}
            id="outlined-adornment-amount"
            placeholder="Comment"
            fullWidth
            style={mobileTextFieldStyle}
            value={this.state.name}
            onChange={this.handleCommentChange} />
          <Row>
            <button className='button-gold' onClick={() => this.openGoldCommentModal()}>
              {"Go Gold"}
            </button>
            <button className='button-green' onClick={() => this.handleSendClick()}>
              {"Send"}
            </button>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <Row style={commentStyle}>
            <TextField
              label="Write a comment"
              className={classNames(classes.margin, classes.textField)}
              id="outlined-adornment-amount"
              placeholder="Comment"
              fullWidth
              style={textFieldStyle}
              value={this.state.name}
              onChange={this.handleCommentChange} />
            <button className='button-gold' onClick={() => this.openGoldCommentModal()}>
              {"Go Gold"}
            </button>
            <button className='button-green' onClick={() => this.handleSendClick()}>
              {"Send"}
            </button>
          </Row>
        </div>
      );
    }
  }

  renderPlayPause() {
    if (this.props.isPlaying) {
      return (
        <img style={playPauseButtonStyle} src='../../../../../images/pause.png'/>
      );
    } else {
      return (
        <img style={playPauseButtonStyle} src='../../../../../images/play.png'/>
      );
    }
  }

  render() {
    const classes = useStyles();
		return (
      <div>
        <CardActionArea style={storyContainerStyle} onClick={() => this.handleStoryClick(this.props.currentStory)}>
          <Paper style={storyPaperStyle}>
            <div>
              <Container>
                <Row>
                  <img style={storyImgStyle} src={this.props.currentStory.profile_picture} backgroundColor={'transparent'}/>
                  <div>
                    <Typography style={storyTitleStyle}>
                      {this.props.currentStory.title}
                    </Typography>
                    <a style={storyTextStyle} href={'#/profile/' + this.props.currentStory.user_id} activeClassName="active">
                      {this.props.currentStory.first_name + " " + this.props.currentStory.last_name}
                    </a>
                  </div>
                </Row>
              </Container>
            </div>
          </Paper>
          {this.renderPlayPause()}
        </CardActionArea>
        <button className='button-rounded-gold' onClick={() => this.openDonateModal()}>
          {"Donate to send a direct message"}
        </button>
        <p style={dividerStyle}>{"or"}</p>
        {this.renderDonateTextField()}
        {this.renderComment()}
        <div style={commentStyle}>
          {this.renderComments()}
        </div>
      </div>
    )
  }
}

export default StoryPage;
