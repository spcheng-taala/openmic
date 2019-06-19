import React, { Component, useRef } from 'react';
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
import ContributeGemsModal from './components/ContributeGemsModal.js';
import ContributorsModal from './components/ContributorsModal.js';
import ContributeGifAnimationModal from './components/ContributeGifAnimationModal.js';

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

const customStylesLight = {
	overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(19, 18, 24, 0.75)',
		maxHeight: '100%',
    overflowY: 'auto',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		background: 'rgba(255, 255, 255, 1)',
    maxHeight: '80%',
    transform: 'translate(-50%, -50%)'
  },
};

const customStyles = {
	overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(19, 18, 24, 0.75)',
		maxHeight: '100%',
    overflowY: 'auto',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		background: '#18161B',
    maxHeight: '80%',
    transform: 'translate(-50%, -50%)'
  },
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
  width: 'calc(100% - 200px)',
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

const rightPanelText = {
  color: '#B8B5BE',
  fontFamily: 'Lato',
  textAlign: 'center',
  fontSize: 17,
  marginTop: 20,
  marginBottom: 20,
  marginRight: 10,
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
      backend: 'MediaElement',
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

    this.refreshComments();
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
    this.copyRef = React.createRef();
    this.state = {
      currentTime: 0,
      duration: 0,
      currentStory: this.props.currentStory,
      contributeGemsIsOpen: false,
      comment: "",
      comments: [],
      isMobile: false,
      nextSecond: 0,
      isFollowing: false,
      clips: [],
      isPlaying: false,
      currentTime: 0,
      contributeGemsIsOpen: false,
      viewContributorsIsOpen: false,
      contributeGifAnimationIsOpen: false,
      gemsContributed: 0,
      currentCommentId: 0,
      contributorsCommentId: 0,
    };

    this.handleStoryClick = this.handleStoryClick.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
    this.getDurationStr = this.getDurationStr.bind(this);
    this.createMinString = this.createMinString.bind(this);
    this.openContributeGemsModal = this.openContributeGemsModal.bind(this);
		this.closeContributeGemsModal = this.closeContributeGemsModal.bind(this);
    this.setContributorsCommentId = this.setContributorsCommentId.bind(this);
    this.closeViewContributorsModal = this.closeViewContributorsModal.bind(this);
    this.openContributeGifAnimationModal = this.openContributeGifAnimationModal.bind(this);
    this.closeContributeGifAnimationModal = this.closeContributeGifAnimationModal.bind(this);
    this.refreshComments = this.refreshComments.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderClipsListItem = this.renderClipsListItem.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
    this.createComment = this.createComment.bind(this);
    this.contributeGems = this.contributeGems.bind(this);
    this.fetchReplies = this.fetchReplies.bind(this);
    this.openClip = this.openClip.bind(this);
  }

  refreshComments() {
    BackendManager.makeQuery('stories/comments', JSON.stringify({
      story_id: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        console.log(data.comments);
        var comments = [];
        for (var i = 0; i < data.comments.length; i++) {
          var comment = data.comments[i];
          comment.children = [];
          if (comment.sum == null) {
            comment.sum = 0;
          }
          if (comment.id != null) {
            comments.push(comment);
            this.fetchReplies(comment.id);
          }
        }
        this.setState({
          comments: comments,
        });
      }
    });
  }

  fetchReplies(commentId) {
    BackendManager.makeQuery('stories/comments/children', JSON.stringify({
      comment_id: commentId,
    }))
    .then(data => {
      if (data.success) {
        console.log(data.comments);
        var comments = this.state.comments;
        var replies = [];
        for (var i = 0; i < comments.length; i++) {
          if (comments[i].id == commentId) {
            for (var j = 0; j < data.comments.length; j++) {
              var c = data.comments[j];
              c.children = [];
              c.root = commentId;
              if (c.sum == null) {
                c.sum = 0;
              }
              if (c.id != null) {
                replies.push(c);
              }
            }
            comments[i].children = replies;
          }
        }
        this.setState({
          comments: comments,
        });
      }
    });
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
      <Comments
        isChild={false}
        comments={this.state.comments}
        sendReply={this.sendReply}
        openContributeGemsModal={this.openContributeGemsModal}
        setContributorsCommentId={this.setContributorsCommentId}
      />
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

  sendReply(reply, parentCommentId, rootCommentId) {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('stories/comments/reply', JSON.stringify({
        story_id: this.props.match.params.id,
        user_id: UserManager.id,
        parent_comment_id: parentCommentId,
        root_comment_id: rootCommentId,
        comment: reply,
      }))
      .then(data => {
        if (data.success) {
          this.refreshComments();
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
            <img
              style={{height: 50, cursor: 'pointer', marginTop: 15, marginLeft: 20}}
              src='../../../../../images/create_clip.png'
              onClick={() => this.openClip()}
              />
            <p style={{paddingLeft: 20, flex: 1}}>{this.state.currentStory.bio}</p>
          </Container>
        </div>
      );
    } else {
      return (
        <Container style={{marginLeft: 10, marginBottom: 20}}>
          <Row>
            <img style={storyImgStyle} src={this.state.currentStory.profile_picture} backgroundColor={'transparent'}/>
            <Col>
              <div>
                <a style={storyTextStyle} onClick={() => this.handleUserClick(this.state.currentStory.user_id)} activeClassName="active">
                  {this.state.currentStory.first_name + " " + this.state.currentStory.last_name}
                </a>
                <Row>
                  <img
                    style={{height: 50, cursor: 'pointer', marginTop: 15, marginLeft: 20}}
                    src='../../../../../images/create_clip.png'
                    onClick={() => this.openClip()}
                    />
                </Row>
                <p style={{paddingLeft: 20, flex: 1}}>{this.state.currentStory.bio}</p>
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
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


  renderClips() {
    return (
      <div>
        <ul>
          {this.state.clips.map((item, index) => {
            return (<ClipItem index={index} id={item.id} title={item.title}
              url={item.url} name={item.username} playClip={this.playClip}
              duration={item.duration}/>)
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

  getPercentage() {
    var percent = 100 * this.state.currentTime/this.state.currentStory.duration;
    return percent + "%";
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

  openContributeGemsModal(commentId) {
    this.setState({
      contributeGemsIsOpen: true,
      currentCommentId: commentId,
    });
  }

  closeContributeGemsModal() {
    this.setState({
      contributeGemsIsOpen: false,
    });
  }

  setContributorsCommentId(id) {
    this.setState({
      viewContributorsIsOpen: true,
      contributorsCommentId: id,
    });
  }

  closeViewContributorsModal() {
    this.setState({
      viewContributorsIsOpen: false,
    });
  }

  openContributeGifAnimationModal(gems) {
    this.setState({
      contributeGifAnimationIsOpen: true,
      gemsContributed: gems,
    });
  }

  closeContributeGifAnimationModal() {
    this.setState({
      contributeGifAnimationIsOpen: false,
      gemsContributed: 0
    });
  }

  renderRightPanel() {
    return (
      <div style={{marginTop: 20, marginRight: 20, marginBottom: 20}}>
        <div>
          <div style={{height: 5}}/>
          <Typography style={rightPanelText}>
            {"Clips!"}
          </Typography>
          <ul>
            {this.state.clips.map((item) => {
              return (this.renderClipsListItem(item))
            })}
          </ul>
          <div style={{paddingBottom: 10}}>
          </div>
        </div>
      </div>
    );
  }

  renderClipsListItem(item) {
    return (
      <div>
        <ClipItem id={item.id} url={item.url} title={item.title} podcast={item.story_title} name={item.username} handleClipClick={this.handleClipClick}/>
        <Divider />
      </div>
    );
  }

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  createComment(gems) {
    BackendManager.makeQuery('stories/comment', JSON.stringify({
      story_id: this.props.match.params.id,
      user_id: UserManager.id,
      comment: this.state.comment,
    }))
    .then(data => {
      if (data.success) {
        this.contributeGems(data.id, gems)
      }
    });
  }

  contributeGems(commentId, gems) {
    this.closeContributeGemsModal();
    BackendManager.makeQuery('stories/comments/gem/add', JSON.stringify({
      comment_id: commentId,
      user_id: UserManager.id,
      gems: gems,
    }))
    .then(data => {
      if (data.success) {
        this.refreshComments();
        BackendManager.makeQuery('gems/user/update', JSON.stringify({
          gem_count: (-1 * gems),
          user_id: UserManager.id,
        }))
        .then(data => {
          if (data.success) {
          }
        });
      }
    });
  }

  render() {
    const classes = useStyles();
		return (
      <div style={{backgroundColor: '#F4F3F6'}}>
        <Modal
          isOpen={this.state.contributeGemsIsOpen}
          style={customStyles}
          onRequestClose={this.closeContributeGemsModal}
          contentLabel="Contribute Gems"
        >
          <ContributeGemsModal commentId={this.state.currentCommentId} contributeGems={this.contributeGems} createComment={this.createComment}/>
        </Modal>
        <Modal
          isOpen={this.state.viewContributorsIsOpen}
          style={customStyles}
          onRequestClose={this.closeViewContributorsModal}
          contentLabel="Contribute Gems"
        >
          <ContributorsModal commentId={this.state.contributorsCommentId}/>
        </Modal>
        <Modal
          isOpen={this.state.viewContributorsIsOpen}
          style={customStylesLight}
          onRequestClose={this.closeViewContributorsModal}
          contentLabel="Yay!"
        >
          <ContributeGifAnimationModal gem={this.state.gemsContributed}/>
        </Modal>
        <div>
          <Row>
            <Col sm={8}>
              <Paper elevation={1} style={{backgroundColor: 'white', marginTop: 20, marginLeft: 20, paddingBottom: 20}}>
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
                {this.renderProfile()}
              </Paper>
              <Row>
                <TextField
                  label={"Chat with " + this.state.currentStory.first_name + " " + this.state.currentStory.last_name}
                  id="outlined-adornment-amount"
                  placeholder="What do you want to say?"
                  fullWidth
                  style={textFieldStyle}
                  value={this.state.name}
                  onChange={this.handleCommentChange} />
                <button className='button-green' onClick={() => this.openContributeGemsModal(0)}>
                  {"Send"}
                </button>
              </Row>
              {this.renderComments()}
            </Col>
            <Col sm={4}>
              <Paper elevation={1} style={{backgroundColor: 'white', marginRight: 20}}>
                {this.renderRightPanel()}
              </Paper>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default StoryPage;
