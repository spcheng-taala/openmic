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
import Fab from '@material-ui/core/Fab';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import SoundPlayerItem from '../../ui/SoundPlayerItem.js';
import ProfilePage from '../profile/ProfilePage.js';
import Comments from './components/Comments.js';
import { PlayButton, PrevButton, NextButton, Progress, Timer, VolumeControl } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon } from 'react-share';
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
  marginTop: 100,
  height: 200,
}

const textFieldMargin = {
  margin: 50,
}

var storyPaperStyle = {
  width: '100%',
  marginBottom: 10,
  backgroundColor: "#7E8C9B",
}

var storyTitleStyle = {
  paddingLeft: 20,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 40,
}

var storyTextStyle = {
  paddingLeft: 20,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 30,
  textDecoration: "underline",
}

var mobileStoryTextStyle = {
  textAlign: 'center',
  color: '#36454f',
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
  width: 60,
  height: 60,
  paddingLeft: 10,
  marginBottom: 10,
}

const heartFabStyle = {
  backgroundColor: "#D14D85",
  float: "right",
  marginRight: 20,
	width: 50,
	height: 50,
}

const heartIconStyle = {
  width: 40,
  height: 40,
}
const iconStyle = {
	width: 30,
	height: 30,
}

class StoryPage extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.props.fetchStory(this.props.match.params.id);
    this.setState({
      duration: this.props.soundCloudAudio.duration,
    });
    var self = this;
    var hasListened = false;
    this.props.soundCloudAudio.on('timeupdate', function() {
      if (self.state.duration == 0) {
        self.setState({
          duration: self.props.currentStory.duration,
        })
      }
      if (!hasListened) {
        BackendManager.makeQuery('public/stories/feed/story/listen', JSON.stringify({
          story_id: self.props.currentStory.id,
        })).then(data => {
          console.log(data);
        });
        hasListened = true;
      }
      self.setState({
        currentTime: self.props.soundCloudAudio.audio.currentTime,
      });
      if (Math.floor(self.props.soundCloudAudio.audio.currentTime) in self.props.emotes && Math.floor(self.props.soundCloudAudio.audio.currentTime) > self.state.nextSecond) {
        var emojis = [];
        for (var i = 0; i < self.props.emotes[Math.floor(self.props.soundCloudAudio.audio.currentTime)].length; i++) {
          if (self.props.emotes[Math.floor(self.props.soundCloudAudio.audio.currentTime)][i].profile_picture == null) {
            emojis.push({profilePicture: '../../../../../images/heart_emoji.png',
              xPath: Math.floor(Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1), yPath: Math.floor(Math.random() * 90),
              time: self.props.soundCloudAudio.audio.currentTime});
          } else {
            emojis.push({profilePicture: self.props.emotes[Math.floor(self.props.soundCloudAudio.audio.currentTime)][i].profile_picture,
              xPath: Math.floor(Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1), yPath: Math.floor(Math.random() * 90),
              time: self.props.soundCloudAudio.audio.currentTime});
          }
        }
        var currentEmojis = self.state.currentEmojis;
        currentEmojis.push({emojis: emojis});
        self.setState({
          currentEmojis: currentEmojis,
          nextSecond: Math.floor(self.props.soundCloudAudio.audio.currentTime) + 1,
        });
      }
    });
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
      currentTime: 0,
      duration: 0,
      currentStory: this.props.currentStory,
      comment: "",
      isMobile: false,
      nextSecond: 0,
      emojis: {
        "1": [
          {
            profile_picture: "https://s3-us-west-2.amazonaws.com/pokadotmedia/sean@pokadotapp.com_1547082885400.315.jpg"
          },
          {
            profile_picture: "https://s3-us-west-2.amazonaws.com/pokadotmedia/sean@pokadotapp.com_1547082885400.315.jpg"
          }
        ],
        "8": [
          {
            profile_picture: null,
          },
          {
            profile_picture: "https://s3-us-west-2.amazonaws.com/pokadotmedia/houston@pokadotapp.com_1547847860205.741.jpg",
          },
          {
            profile_picture: "https://s3-us-west-2.amazonaws.com/pokadotmedia/houston@pokadotapp.com_1547847860205.741.jpg",
          },
          {
            profile_picture: null,
          },
          {
            profile_picture: "https://s3-us-west-2.amazonaws.com/pokadotmedia/sean@pokadotapp.com_1547082885400.315.jpg",
          },
        ]
      },
      currentEmojis: [],
      isFollowing: false,
    };

    this.handleStoryClick = this.handleStoryClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.openGoldCommentModal = this.openGoldCommentModal.bind(this);
    this.openDonateModal = this.openDonateModal.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
    this.renderEmojis = this.renderEmojis.bind(this);
    this.getDurationStr = this.getDurationStr.bind(this);
    this.handleHeartClick = this.handleHeartClick.bind(this);
  }

  handleStoryClick(story) {
    this.props.history.push('/story/' + story.id);
    this.props.handleStoryClick(story.id);
    this.props.playPauseSound();
  }

  handleUserClick(id) {
    this.props.history.push('/profile/' + id);
  }

  handleCommentChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleFollowClick() {
    if (this.props.isLoggedIn) {
      var status = 1
      for (var i = 0; i < this.props.following.length; i++) {
        if (this.props.following[i].id == this.props.currentStory.user_id) {
          status = -1;
        }
      }
      this.props.handleFollowClick(this.props.currentStory.user_id,
        this.props.currentStory.profile_picture,
        this.props.currentStory.first_name,
        this.props.currentStory.last_name,
        this.props.currentStory.bio,
        status,
      );
      this.setState({
        isFollowing: !this.state.isFollowing,
      });
    } else {
      this.props.openLoginModal();
    }
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

  getDurationStr(totalDuration) {
    var totalSeconds = totalDuration;
    var years = Math.floor(totalSeconds/(3600 * 24 * 365));
    totalSeconds -= (years * 3600 * 24 * 365);
    var months = Math.floor(totalSeconds/(3600 * 24 * 30));
    totalSeconds -= (months * 3600 * 24 * 30);
    let days = Math.floor(totalSeconds/(3600 * 24))
    totalSeconds -= (days * 3600 * 24);
    let hours = Math.floor(totalSeconds/3600);
    totalSeconds -= (hours * 3600);
    let minutes = Math.floor(totalSeconds/60);
    totalSeconds -= (minutes * 60);
    var totalDurationStr = "";

    if (years > 0) {
        totalDurationStr = String(years) + "y ";
    }

    if (months > 0) {
        totalDurationStr += String(months) + "mo ";
    }

    if (days > 0) {
        totalDurationStr += String(days) + "d ";
    }

    if (hours > 0) {
        totalDurationStr += String(hours) + "h ";
    }

    if (minutes > 0) {
        totalDurationStr += String(minutes) + "min ";
    }

    totalDurationStr += String(totalSeconds) + "s";

    return totalDurationStr;
  }

  renderFollowButton() {
    var isFollowing = this.state.isFollowing;
    for (var i = 0; i < this.props.following.length; i++) {
      if (this.props.following[i].id == this.props.currentStory.user_id) {
        isFollowing = true;
      }
    }

    if (isFollowing) {
      return (
        <div>
          <button className='button-rounded-purple-empty' onClick={() => this.handleFollowClick()} style={{marginTop: 10, marginLeft: 30}}>
            {"Unfollow"}
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button className='button-rounded-purple' onClick={() => this.handleFollowClick()} style={{marginTop: 10, marginLeft: 30}}>
            {"Follow"}
          </button>
        </div>
      );
    }
  }

  renderProfile() {
    if (this.state.isMobile) {
      return (
        <div>
          <div style={{width: '100%', textAlign: 'center', marginTop: 100}}>
            <img style={{display: 'inline-block', height: 200, marginBottom: 20}} src={this.props.currentStory.profile_picture} backgroundColor={'transparent'}/>
          </div>
          <Container>
            <a style={storyTextStyle} onClick={() => this.handleUserClick(this.props.currentStory.user_id)} activeClassName="active">
              {this.props.currentStory.first_name + " " + this.props.currentStory.last_name}
            </a>
            {this.renderFollowButton()}
            <button className='button-rounded-gold' onClick={() => this.openDonateModal()} style={{marginTop: 10, marginLeft: 10}}>
              {"Send a direct message"}
            </button>
            <p style={{paddingLeft: 20, flex: 1}}>{this.props.currentStory.bio}</p>
          </Container>
        </div>
      );
    } else {
      return (
        <Container style={{marginBottom: 20}}>
          <Row>
            <img style={storyImgStyle} src={this.props.currentStory.profile_picture} backgroundColor={'transparent'}/>
            <Col>
              <div style={{marginTop: 100}}>
                <a style={storyTextStyle} onClick={() => this.handleUserClick(this.props.currentStory.user_id)} activeClassName="active">
                  {this.props.currentStory.first_name + " " + this.props.currentStory.last_name}
                </a>
                <Row>
                  {this.renderFollowButton()}
                  <button className='button-rounded-gold' onClick={() => this.openDonateModal()} style={{marginTop: 10, marginLeft: 0}}>
                    {"Send a direct message"}
                  </button>
                </Row>
                <p style={{paddingLeft: 20, flex: 1}}>{this.props.currentStory.bio}</p>
                <Row>
                  <img style={{marginTop: 17, marginLeft: 30, width: 20, height: 20}} src='../../../../../images/ear.png'/>
                  <p style={{color: "#888888"}}>{this.getDurationStr(this.props.totalListenedTo)}</p>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      );
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
            <button className='button-gold' onClick={() => this.openGoldCommentModal()} style={{marginTop: 30, marginLeft: 20}}>
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

  getPercentage() {
    var percent = 100 * this.state.currentTime/this.props.currentStory.duration;
    return percent + "%";
  }

  renderEmojis() {
    return (
      <div>
        <div>
          {this.state.currentEmojis.map((item) => (
            <div id="fish" class="fish">
              {item.emojis.map((emoji) => (
                <div>
                  <Avatar src={emoji.profilePicture == null ? '../../../../images/heart_emoji.png':emoji.profilePicture} style={{position: 'absolute', height: 50, width: 50, top: emoji.yPath, left: emoji.xPath}}/>
                  <Avatar src={emoji.profilePicture != null ? '../../../../images/heart_emoji.png':''} style={{position: 'absolute', height: 20, width: 20, top: emoji.yPath + 35, left: emoji.xPath + 30}}/>
                </div>
               ))}
            </div>
            ))}
        </div>
      </div>
    );
  }

  handleHeartClick() {
    var emotes = this.state.emojis;
    var emojis = [];
    if (!this.props.isLoggedIn) {
      emojis.push({profilePicture: '../../../../../images/heart_emoji.png',
        xPath: Math.floor(Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1), yPath: Math.floor(Math.random() * 90),
        time: this.state.currentTime});
    } else {
      emojis.push({profilePicture: UserManager.profilePicture,
        xPath: Math.floor(Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1), yPath: Math.floor(Math.random() * 90),
        time: this.state.currentTime});
    }
    var currentEmojis = this.state.currentEmojis;
    currentEmojis.push({emojis: emojis});
    this.setState({
      currentEmojis: currentEmojis,
    });
    this.props.handleEmoteClick(this.props.currentStory.id, this.state.currentTime);
  }

  render() {
    const classes = useStyles();
		return (
      <div>        
        <CardActionArea style={storyContainerStyle} onClick={() => this.handleStoryClick(this.props.currentStory)}>
          <Paper style={storyPaperStyle}>
            <div className='filler' style={{ width: this.getPercentage(), position: "absolute" }}></div>
            <Container style={{marginTop: 10, position: "absolute", zIndex: 1, backgroundColor: "transparent"}}>
              <Row>
                {this.renderPlayPause()}
                <div>
                  <Typography style={storyTitleStyle}>
                    {this.props.currentStory.title}
                  </Typography>
                </div>
              </Row>
            </Container>
          </Paper>
        </CardActionArea>
        {this.renderEmojis()}
        {this.renderProfile()}
        <Divider style={{margin: 10}}/>
        <p style={{fontSize: 20, textAlign: 'center'}}>{"Chat with " + this.props.currentStory.first_name + " " + this.props.currentStory.last_name + "!"}</p>
        {this.renderDonateTextField()}
        {this.renderComment()}
        <div style={commentStyle}>
          {this.renderComments()}
        </div>
        <div className="footer" style={{zIndex: 10}}>
          <div className={"fab"}
            style={{position: "absolute", float: "right", marginRight: 35, paddingBottom: 300, cursor: 'pointer'}}
            onClick={() => this.handleHeartClick()}>
            <img style={heartIconStyle} src='../../../../../images/heart_filled.png'/>
          </div>
          <div className={"fab"} style={{position: "absolute", float: "right", marginRight: 40, paddingBottom: 260, cursor: 'pointer'}}>
            <TwitterShareButton
              url={"https://theopenmic.fm/story/" + this.props.currentStory.id}
              title={this.props.currentStory.title}
              className="share-button">
              <TwitterIcon
                size={32}
                round />
            </TwitterShareButton>
          </div>
          <div className={"fab"} style={{position: "absolute", float: "right", marginRight: 40, paddingBottom: 220, cursor: 'pointer'}}>
            <FacebookShareButton
              url={"https://theopenmic.fm/story/" + this.props.currentStory.id}
              quote={this.props.currentStory.title}
              className="share-button">
              <FacebookIcon
                size={32}
                round />
            </FacebookShareButton>
          </div>
        </div>
      </div>
    )
  }
}

export default StoryPage;
