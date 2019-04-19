import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import WaveSurfer from 'wavesurfer.js';
import ReactTooltip from 'react-tooltip';
import InputRange from 'react-input-range';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import TwitterLogin from './components/TwitterLogin.js';
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
import ReactPlayer from 'react-player';
import Fab from '@material-ui/core/Fab';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import SoundPlayerItem from '../../ui/SoundPlayerItem.js';
import ProfilePage from '../profile/ProfilePage.js';
import Comments from './components/Comments.js';
import { PlayButton, PrevButton, NextButton, Progress, Timer, VolumeControl } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon } from 'react-share';
import ClipItem from './components/ClipItem.js';
import ShareModal from './components/ShareModal.js';
// some track meta information
const trackTitle = 'Immigration and the wall';
var wavesurfer = null;

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

const clipStyle = {
  width: 70,
  height: 70,
  display: 'inline-block',
  marginBottom: 50,
  left: '50%',
}

const clip = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  // overflow: 'hidden',
  marginTop: 20,
}

const textStyleBig = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 30,
  marginLeft: 20,
  marginRight: 50,
}

const textStyleSmall = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 20,
  marginLeft: 20,
  marginRight: 50,
  marginBottom: 20,
}

class StoryPage extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    var ctx = document.createElement('canvas').getContext('2d');
    var linGrad = ctx.createLinearGradient(0, 64, 0, 200);
    linGrad.addColorStop(0.5, 'rgba(168, 180, 236, 1.000)');
    linGrad.addColorStop(0.5, 'rgba(224, 228, 248, 1.000)');
    var progressGrad = ctx.createLinearGradient(0, 64, 0, 200);
    progressGrad.addColorStop(0.5, 'rgba(39, 64, 178, 1.000)');
    progressGrad.addColorStop(0.5, 'rgba(98, 120, 221, 1.000)');
    wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: linGrad,
      progressColor: progressGrad,
      scrollParent: false,
      cursorWidth: 0,
      barHeight: 1,
      barWidth: 2,
      barGap: 2,
    });
    BackendManager.makeQuery('public/stories/feed/story', JSON.stringify({
      story_id: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        UserManager.currentStory = data.story;
        this.setState({
          currentStory: UserManager.currentStory
        });
        wavesurfer.load(data.story.url);
      }
    });
    var self = this;
    wavesurfer.on('finish', function() {
      self.setState({
        isPlaying: false,
      });
    });
    wavesurfer.on('audioprocess', function(progress) {
      var currentTime = Math.floor(progress);
      self.setState({
        currentTime: Math.floor(progress),
      });
    //   if (currentTime in self.props.emotes && currentTime > self.state.nextSecond) {
    //     var emojis = [];
    //     for (var i = 0; i < self.props.emotes[currentTime].length; i++) {
    //       if (self.props.emotes[currentTime][i].profile_picture == null) {
    //         emojis.push({profilePicture: '../../../../../images/heart_emoji.png',
    //           xPath: Math.floor(Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1), yPath: Math.floor(Math.random() * 90),
    //           time: currentTime});
    //       } else {
    //         emojis.push({profilePicture: self.props.emotes[currentTime][i].profile_picture,
    //           xPath: Math.floor(Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1), yPath: Math.floor(Math.random() * 90),
    //           time: currentTime});
    //       }
    //     }
    //     var currentEmojis = self.state.currentEmojis;
    //     currentEmojis.push({emojis: emojis});
    //     console.log(progress);
    //     self.setState({
    //       currentEmojis: currentEmojis,
    //       nextSecond: currentTime + 1,
    //     });
    //   }
    });
    var hasListened = false;
    BackendManager.makeQuery('clips/story', JSON.stringify({
      story_id: this.props.match.params.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
					clips: data.clips,
        });
      }
    });
  }

  componentWillUnmount() {
    wavesurfer.stop();
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

    this.playerRef = React.createRef();

    this.state = {
      currentTime: 0,
      duration: 0,
      currentStory: this.props.currentStory,
      comment: "",
      isMobile: false,
      nextSecond: 0,
      emojis: {},
      currentEmojis: [],
      isFollowing: false,
      clips: [],
      currentClip: null,
      isPlaying: false,
      isPlayingClip: false,
      currentTime: 0,
      clipDuration: 0,
      clipValue: 0,
      scrubberShouldMove: true,
      isShareModalOpen: false,
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
    this.renderClips = this.renderClips.bind(this);
    this.playClip = this.playClip.bind(this);
    this.openClip = this.openClip.bind(this);
    this.renderPlayer = this.renderPlayer.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.createMinString = this.createMinString.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.handleScrubberMove = this.handleScrubberMove.bind(this);
    this.closeClip = this.closeClip.bind(this);
    this.renderPlayPauseReplay = this.renderPlayPauseReplay.bind(this);
    this.pauseClip = this.pauseClip.bind(this);
    this.resumeClip = this.resumeClip.bind(this);
    this.replayClip = this.replayClip.bind(this);
    this.openShareModal = this.openShareModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.renderClipToolTip = this.renderClipToolTip.bind(this);
    this.onTwitterAuthSuccess = this.onTwitterAuthSuccess.bind(this);
    this.onTwitterAuthFailure = this.onTwitterAuthFailure.bind(this);
  }

  handleStoryClick(story) {
    if (wavesurfer != null) {
      if (!wavesurfer.isPlaying()) {
        this.setState({
          isPlaying: true,
        });
        wavesurfer.play();
      } else {
        this.setState({
          isPlaying: false,
        });
        wavesurfer.pause();
      }
    }
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
        if (this.props.following[i].id == this.state.currentStory.user_id) {
          status = -1;
        }
      }
      this.props.handleFollowClick(this.state.currentStory.user_id,
        this.state.currentStory.profile_picture,
        this.state.currentStory.first_name,
        this.state.currentStory.last_name,
        this.state.currentStory.bio,
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
        story_id: this.state.currentStory.id,
        name: UserManager.firstName + " " + UserManager.lastName,
        email: UserManager.email,
        comment: this.state.comment,
        title: this.state.currentStory.title,
      }))
      .then(data => {
        if (data.success) {
          this.props.showToast("Sent!");
          this.props.fetchComments(this.state.currentStory.id);
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
        story_id: this.state.currentStory.id,
        name: UserManager.firstName + " " + UserManager.lastName,
        email: UserManager.email,
        comment: reply,
        title: this.state.currentStory.title,
        parent_comment_id: parentCommentId,
        parent_email: parentEmail,
      }))
      .then(data => {
        if (data.success) {
          this.props.showToast("Sent!");
          this.props.fetchComments(this.state.currentStory.id);
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
      if (this.props.following[i].id == this.state.currentStory.user_id) {
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
          <div style={{width: '100%', textAlign: 'center'}}>
            <img style={{display: 'inline-block', height: 200, marginBottom: 20}} src={this.state.currentStory.profile_picture} backgroundColor={'transparent'}/>
          </div>
          <Container>
            <a style={storyTextStyle} onClick={() => this.handleUserClick(this.state.currentStory.user_id)} activeClassName="active">
              {this.state.currentStory.first_name + " " + this.state.currentStory.last_name}
            </a>
            {this.renderFollowButton()}
            <button className='button-rounded-gold' onClick={() => this.openDonateModal()} style={{marginTop: 10, marginLeft: 10}}>
              {"Send a direct message"}
            </button>
            <p style={{paddingLeft: 20, flex: 1}}>{this.state.currentStory.bio}</p>
          </Container>
        </div>
      );
    } else {
      return (
        <Container style={{marginBottom: 20}}>
          <Row>
            <img style={storyImgStyle} src={this.state.currentStory.profile_picture} backgroundColor={'transparent'}/>
            <Col>
              <div>
                <a style={storyTextStyle} onClick={() => this.handleUserClick(this.state.currentStory.user_id)} activeClassName="active">
                  {this.state.currentStory.first_name + " " + this.state.currentStory.last_name}
                </a>
                <Row>
                  {this.renderFollowButton()}
                  <button className='button-rounded-gold' onClick={() => this.openDonateModal()} style={{marginTop: 10, marginLeft: 0}}>
                    {"Send a direct message"}
                  </button>
                </Row>
                <p style={{paddingLeft: 20, flex: 1}}>{this.state.currentStory.bio}</p>
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

  renderClips() {
    return (
      <div>
        <ul>
          {this.state.clips.map((item, index) => {
            return (<ClipItem index={index} id={item.id} title={item.title}
              url={item.url} name={item.first_name} playClip={this.playClip}
              currentClip={this.state.currentClip} duration={item.duration}/>)
          })}
        </ul>
      </div>
    );
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
          <Row>
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
    if (this.state.isPlaying) {
      return (
        <img style={playPauseButtonStyle} src='../../../../../images/pause.png'/>
      );
    } else {
      return (
        <img style={playPauseButtonStyle} src='../../../../../images/play.png'/>
      );
    }
  }

  renderPlayPauseReplay() {
    if (!this.state.isPlayingClip) {
      return (
        <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 10}} onClick={() => this.resumeClip()}>
          <img
            style={{ marginLeft: 10, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
            src='../../../../../images/play_simple.png'
            />
        </div>
      );
    } else {
      if (this.state.clipValue == this.state.clipDuration) {
        <img
          style={{marginLeft: 10, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
          src='../../../../../images/replay.png'
          onClick={() => this.replayClip()}/>
      }
      return (
        <div style={{marginLeft: 10, width: 50, height: 50, cursor: 'pointer', zIndex: 20}} onClick={() => this.pauseClip()}>
          <img
            style={{marginLeft: 10, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
            src='../../../../../images/pause_simple.png'
            />
        </div>
      );
    }
  }

  pauseClip() {
    this.setState({
      isPlayingClip: false,
    });
  }

  resumeClip() {
    this.setState({
      isPlayingClip: true,
    });
  }

  replayClip() {

  }

  getPercentage() {
    var percent = 100 * this.state.currentTime/this.state.currentStory.duration;
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
    this.props.handleEmoteClick(this.state.currentStory.id, this.state.currentTime);
  }

  createMinString(seconds) {
    var minutes = Math.floor(seconds/60);
    var remainingSeconds = Math.floor(seconds - minutes * 60);
    if (remainingSeconds < 10) {
      return minutes + ":0" + remainingSeconds;
    } else {
      return minutes + ":" + remainingSeconds;
    }
  }


  playClip(index) {
    console.log(this.state.clips[index]);
    this.setState({
      currentClip: this.state.clips[index],
      isPlayingClip: true,
    });
    if (wavesurfer != null) {
      if (wavesurfer.isPlaying()) {
        this.setState({
          isPlaying: false,
        });
        wavesurfer.pause();
      }
    }
    if (this.playerRef != null) {
      window.scrollTo(0, this.playerRef.current.offsetTop);
    }
  }

  handleVideoProgress(state) {
    var seconds = state.played * this.player.getDuration();
    if (this.state.scrubberShouldMove) {
      this.setState({
        clipValue: seconds,
      });
    }
    console.log(seconds);
    console.log(this.state.clipDuration);
  }

  handleDurationChange(duration) {
    this.setState({
      clipDuration: duration,
    });
  }

  renderPlayer() {
    if (this.state.currentClip != null) {
      return (
        <Card style={{marginLeft: 20, marginRight: 20}}>
          <div style={{backgroundColor: '#0F0D12', paddingBottom: 30}}>
            <img src='../../../../../images/cancel.png' style={{marginLeft: 20, marginTop:20, width: 40, height: 40, cursor: 'pointer'}} onClick={() => this.closeClip()} />
            <div style={clip}>
              <ReactPlayer
                ref={this.ref}
                url={this.state.currentClip.url}
                onProgress={this.handleVideoProgress}
                onDuration={this.handleDurationChange}
                playing={this.state.isPlayingClip} />
            </div>
            <div style={{marginTop: 20, marginRight: 25, marginLeft: 25}}>
              <InputRange
                draggableTrack
                maxValue={this.state.clipDuration}
                minValue={0}
                formatLabel={value => this.createMinString(value)}
                onChange={value => this.handleScrubberMove(value)}
                onChangeComplete={value => this.playAtValue(value)}
                value={this.state.clipValue} />
              {this.renderPlayPauseReplay()}
            </div>
          </div>
          <Row>
            <Col>
              <Typography style={textStyleBig}>
                {this.state.currentClip.title}
              </Typography>
              <Typography style={textStyleSmall}>
                {"Clipped by " + this.state.currentClip.first_name}
              </Typography>
            </Col>
            <button className='button-rounded' style={{ marginTop: 20, marginRight: 30 }} data-tip data-for='share_clip' data-event='click'>Share</button>
            <ReactTooltip id='share_clip' place='top' effect='solid' clickable={true}>
              <Row style={{marginLeft: 20}}>
                <TwitterLogin
                  style={{width: 30, height: 30, backgroundColor: '#1DA1F2', cursor: 'pointer', padding: 0}}
                  loginUrl="http://localhost:8080/pp/auth/twitter"
                  onFailure={this.onTwitterAuthFailure}
                  onSuccess={this.onTwitterAuthSuccess}
                  requestTokenUrl="http://localhost:8080/pp/auth/twitter/reverse"
                >
                  <img style={{width: 20, height: 20}} src='../../../../../images/twitter_icon.png'/>
                </TwitterLogin>
                <div style={{marginLeft: 10, backgroundColor: '#3ABBBC', width: 30, height: 30, cursor: 'pointer'}}>
                  <img style={{width: 30, height: 30}} src='../../../../../images/copy.png'/>
                </div>
              </Row>
              <input type='text' value={'https://theopenmic.fm/clips/' + this.state.currentClip.id} style={{width: 100, marginTop: 10}} />
            </ReactTooltip>
          </Row>
        </Card>
      );
    }
  }

  onTwitterAuthFailure(error) {
    alert(error);
  }

  onTwitterAuthSuccess(response) {
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

  closeClip() {
    this.setState({
      isPlayingClip: false,
      currentClip: null,
    });
  }

  openClip() {
    if (wavesurfer != null) {
      localStorage.setItem('url', this.state.currentStory.url);
      localStorage.setItem('clip_time', Math.floor(wavesurfer.getCurrentTime()));
      localStorage.setItem('duration', wavesurfer.getDuration());
      localStorage.setItem('story_id', this.state.currentStory.id);
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        this.setState({
          isPlaying: false,
        });
      }
      window.open('/clip');
    }
  }

  handleScrubberMove(value) {
    this.setState({
      scrubberShouldMove: false,
      clipValue: value,
      isPlayingClip: false,
    });
  }

  playAtValue(value) {
    this.setState({
      scrubberShouldMove: true,
      isPlayingClip: true,
    });
    this.player.seekTo(parseFloat(value));
  }

  ref = player => {
    this.player = player
  }

  openShareModal() {
    this.setState({
      isShareModalOpen: true,
    });
  }

  closeShareModal() {
    this.setState({
      isShareModalOpen: false,
    });
  }

  renderClipToolTip() {
    if (wavesurfer != null) {
      return (
        <ReactTooltip id="clip" place="bottom" type="dark" effect="float">
          <span>{"Create clip at " + this.createMinString(this.state.currentTime)}</span>
        </ReactTooltip>
      );
    }
  }

  render() {
    const classes = useStyles();
		return (
      <div>
        <Modal
          isOpen={this.state.isShareModalOpen}
          onRequestClose={this.closeShareModal}
          style={customStyles}
          contentLabel="Share"
        >
          <ShareModal clip={this.state.currentClip}/>
        </Modal>
        <CardActionArea style={storyContainerStyle} onClick={() => this.handleStoryClick(this.props.currentStory)}>
          <Paper style={storyPaperStyle}>
            <Container style={{marginTop: 10, position: "absolute", zIndex: 1, backgroundColor: "transparent"}}>
              <Row>
                {this.renderPlayPause()}
                <div>
                  <Typography style={storyTitleStyle}>
                    {this.state.currentStory.title}
                  </Typography>
                </div>
              </Row>
            </Container>
          </Paper>
        </CardActionArea>
        <div id="waveform" style={{ margin: 50 }}></div>
        {this.renderEmojis()}
        {this.renderProfile()}
        <Divider style={{margin: 10}}/>
        <p style={{fontSize: 20, textAlign: 'center'}}>{"Clips"}</p>
        {this.renderDonateTextField()}
        <div ref={this.playerRef}>
          {this.renderPlayer()}
        </div>
        <div style={{marginLeft: 50, marginRight: 50}}>
          {this.renderClips()}
        </div>
          <Avatar data-tip data-for='clip'
            style={{
              position: 'fixed',
              bottom: 25,
              zIndex: 10,
              left: '93%',
              cursor: 'pointer',
              width: 75,
              height: 75,
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}
            src='../../../../../images/clip.png'
            onClick={() => this.openClip()}/>
          {this.renderClipToolTip()}

      </div>
    )
  }
}

export default StoryPage;
