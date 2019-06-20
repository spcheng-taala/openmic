import React, { Component } from 'react';
import './assets/index.scss';
import "react-input-range/lib/css/index.css";
import InputRange from 'react-input-range';
import ReactTooltip from 'react-tooltip';
import TwitterLogin from './components/TwitterLogin.js';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import { Container, Row, Col } from 'react-grid-system';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ClipItem from './components/ClipItem.js';
import Comments from './components/Comments.js';
import ContributeGemsModal from './components/ContributeGemsModal.js';
import ContributorsModal from './components/ContributorsModal.js';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';

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

const textFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
  marginLeft: 50,
  width: 'calc(100% - 200px)',
  marginRight: 20,
}

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

const centerVertical = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
}

const topPanelText = {
  color: '#164747',
  fontFamily: 'Lato',
  textAlign: 'left',
  fontSize: 17,
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

const aboutText = {
  color: '#818181',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 17,
  marginLeft: 25,
  marginRight: 50,
}

const aboutTextSmall = {
  color: '#818181',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 13,
  marginLeft: 25,
  marginRight: 50,
}

const textStyleBig = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 30,
  marginLeft: 25,
  marginRight: 50,
}

const textStyleSmall = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 20,
  marginLeft: 25,
  marginRight: 50,
  marginBottom: 20,
}

const textStyleBigMobile = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 20,
  marginLeft: 10,
  marginRight: 50,
}

const textStyleSmallMobile = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 15,
  marginLeft: 10,
  marginRight: 50,
  marginBottom: 20,
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

class ClipPage extends Component {

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    BackendManager.makeQuery('clips', JSON.stringify({
      clip_id: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          clip: data.clip,
        });
        BackendManager.makeQuery('clips/others', JSON.stringify({
          clip_id: this.props.match.params.id,
          story_id: data.clip.story_id,
        }))
        .then(data => {
          if (data.success) {
            console.log(data.clips);
            this.setState({
              otherClips: data.clips,
            });
          }
        });
      }
    });

    this.refreshComments();

    BackendManager.makeQuery('clips/reactions/pos', JSON.stringify({
      clip_id: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          heartCount: data.reaction,
        });
      }
    });

    BackendManager.makeQuery('clips/reactions/check', JSON.stringify({
      clip_id: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          hasLiked: data.reaction > 0,
        });
      }
    });
  }

  componentDidUpdate() {
    if (this.state.clip == null || this.props.match.params.id != this.state.clip.id) {
      BackendManager.makeQuery('clips', JSON.stringify({
        clip_id: this.props.match.params.id,
      }))
      .then(data => {
        if (data.success) {
          this.setState({
            clip: data.clip,
          });
          BackendManager.makeQuery('clips/others', JSON.stringify({
            clip_id: this.props.match.params.id,
            story_id: data.clip.story_id,
          }))
          .then(data => {
            if (data.success) {
              console.log(data.clips);
              this.setState({
                otherClips: data.clips,
              });
            }
          });
        }
      });

      this.refreshComments();

      BackendManager.makeQuery('clips/reactions/pos', JSON.stringify({
        clip_id: this.props.match.params.id,
      }))
      .then(data => {
        if (data.success) {
          this.setState({
            heartCount: data.reaction,
          });
        }
      });

      BackendManager.makeQuery('clips/reactions/check', JSON.stringify({
        clip_id: this.props.match.params.id,
      }))
      .then(data => {
        if (data.success) {
          this.setState({
            hasLiked: data.reaction > 0,
          });
        }
      });
    }
  }

  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
    this.state = {
      isMobile: false,
      contributeGemsIsOpen: false,
      clip: null,
      isPlaying: true,
      value: 0,
      duration: 0,
      scrubberShouldMove: true,
      isFinished: false,
      otherClips: [],
      comments: [],
      hasAboutOpen: false,
      heartCount: 0,
      hasLiked: false,
      comment: "",
      currentCommentId: 0,
      contributorsCommentId: 0,
      viewContributorsIsOpen: false,
    };

    this.createMinString = this.createMinString.bind(this);
    this.openContributeGemsModal = this.openContributeGemsModal.bind(this);
		this.closeContributeGemsModal = this.closeContributeGemsModal.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleScrubberMove = this.handleScrubberMove.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.renderView = this.renderView.bind(this);
    this.onTwitterAuthSuccess = this.onTwitterAuthSuccess.bind(this);
    this.onTwitterAuthFailure = this.onTwitterAuthFailure.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.replay = this.replay.bind(this);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
    this.renderBottomVideoPlayer = this.renderBottomVideoPlayer.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderOtherClipsListItem = this.renderOtherClipsListItem.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
    this.renderTopView = this.renderTopView.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.toggleAbout = this.toggleAbout.bind(this);
    this.renderAbount = this.renderAbout.bind(this);
    this.renderHeart = this.renderHeart.bind(this);
    this.handleHeartClick = this.handleHeartClick.bind(this);
    this.getCountStr = this.getCountStr.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.createComment = this.createComment.bind(this);
    this.contributeGems = this.contributeGems.bind(this);
    this.refreshComments = this.refreshComments.bind(this);
    this.fetchReplies = this.fetchReplies.bind(this);
    this.setContributorsCommentId = this.setContributorsCommentId.bind(this);
    this.closeViewContributorsModal = this.closeViewContributorsModal.bind(this);
  }

  refreshComments() {
    BackendManager.makeQuery('clips/comments', JSON.stringify({
      clip_id: this.props.match.params.id,
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
    BackendManager.makeQuery('clips/comments/children', JSON.stringify({
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

  openContributeGemsModal(commentId) {
    if (this.props.isLoggedIn) {
      this.setState({
        contributeGemsIsOpen: true,
        currentCommentId: commentId,
      });
    } else {
      this.props.openLoginModal();
    }
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

  getCountStr(count) {
    if (count < 1000) {
      return count;
    } else if (count < 100000) {
      var newCount = count/1000;
      var countStr = Math.round(newCount * 10) / 10;
      return countStr + "k";
    } else if (count < 1000000) {
      var newCount = count/1000;
      return Math.round(newCount) + "k";
    } else {
      var newCount = count / 1000000;
      return Math.round(newCount) + "m";
    }
  }

  replay() {
    this.setState({
      isFinished: false,
      isPlaying: true,
    });
    this.playAtValue(0);
  }

  togglePlayPause() {
    var isPlaying = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlaying,
    });
  }

  renderPlayPause() {
    if (this.state.isFinished) {
      return (
        <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 20}} onClick={() => this.replay()}>
          <img
            style={{marginLeft: 20, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
            src='../../../../../images/replay.png'
            />
        </div>
      );
    } else {
      if (this.state.isPlaying) {
        return (
          <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 20}} onClick={() => this.togglePlayPause()}>
            <img
              style={{marginLeft: 20, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
              src='../../../../../images/pause_simple.png'
              />
          </div>
        );
      } else {
        return (
          <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 10}} onClick={() => this.togglePlayPause()}>
            <img
              style={{marginLeft: 20, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
              src='../../../../../images/play_simple.png'
              />
          </div>
        );
      }
    }
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

  handleVideoProgress(state) {
    var seconds = state.played * this.player.getDuration();
    if (this.state.scrubberShouldMove) {
      this.setState({
        value: seconds,
      });
    }

    if (seconds == this.state.duration) {
      this.setState({
        isPlaying: false,
        isFinished: true,
        value: 0,
      });
    }
  }

  ref = player => {
    this.player = player
  }

  handleDurationChange(duration) {
    this.setState({
      duration: duration,
    });
  }

  handleScrubberMove(value) {
    this.setState({
      scrubberShouldMove: false,
      value: value,
      isPlaying: false,
    });
  }

  playAtValue(value) {
    this.setState({
      scrubberShouldMove: true,
      isPlaying: true,
    });
    this.player.seekTo(parseFloat(value));
  }

  toggleAbout() {
    this.setState({
      hasAboutOpen: !this.state.hasAboutOpen
    });
  }

  renderAbout() {
    if (this.state.hasAboutOpen) {
      if (this.state.isMobile) {
        return (
          <div>
            <Typography style={aboutTextSmall}>
              {this.state.clip.bio}
            </Typography>
            <button className='button-rounded-grey-no-mar-small' style={{ margin: 10 }} onClick={() => this.toggleAbout()}>{'Hide Podcast Details'}</button>
          </div>
        );
      } else {
        return (
          <div>
            <Typography style={aboutText}>
              {this.state.clip.bio}
            </Typography>
            <button className='button-rounded-grey-no-mar-small' style={{ margin: 10 }} onClick={() => this.toggleAbout()}>{'Hide Podcast Details'}</button>
          </div>
        );
      }
    } else {
      return (
        <button className='button-rounded-grey-no-mar-small' style={{ margin: 10 }} onClick={() => this.toggleAbout()}>{'Show Podcast Details'}</button>
      );
    }
  }

  renderVideoPlayer() {
    return (
      <div>
        <div style={{margin: 20}}>
          <Card>
            <div style={{backgroundColor: '#0F0D12'}}>
              <div style={root}>
                <ReactPlayer
                  ref={this.ref}
                  style={{marginTop: 20}}
                  url={this.state.clip.url}
                  onProgress={this.handleVideoProgress}
                  onDuration={this.handleDurationChange}
                  playing={this.state.isPlaying} />
              </div>
              <div style={{marginTop: 20, marginRight: 25, marginLeft: 25}}>
                <InputRange
                  draggableTrack
                  maxValue={this.state.duration}
                  minValue={0}
                  formatLabel={value => this.createMinString(value)}
                  onChange={value => this.handleScrubberMove(value)}
                  onChangeComplete={value => this.playAtValue(value)}
                  value={this.state.value} />
                {this.renderPlayPause()}
              </div>
            </div>
            {this.renderBottomVideoPlayer()}
          </Card>
        </div>
      </div>
    );
  }

  renderHeart() {
    if (this.props.isLoggedIn || !this.state.hasLiked) {
      if (this.state.isMobile) {
        return (
          <img style={{width: 25, height: 25}} src='../../../../../images/heart_purple_empty.png'/>
        );
      } else {
        return (
          <img style={{width: 40, height: 40}} src='../../../../../images/heart_purple_empty.png'/>
        );
      }
    } else {
      if (this.state.isMobile) {
        return (
          <img style={{width: 25, height: 25}} src='../../../../../images/heart_purple.png'/>
        );
      } else {
        return (
          <img style={{width: 40, height: 40}} src='../../../../../images/heart_purple.png'/>
        );
      }
    }
  }

  handleHeartClick() {
    if (this.props.isLoggedIn) {
      var reaction = 1;
      if (this.state.hasLiked) {
        reaction = 0;
      }
      BackendManager.makeQuery('clips/react', JSON.stringify({
        clip_id: this.props.match.params.id,
        user_id: UserManager.id,
        reaction: reaction,
      }))
      .then(data => {
        if (data.success) {
          if (reaction == 1) {
            this.setState({
              hasLiked: true,
              heartCount: this.state.heartCount += 1,
            });
          } else {
            this.setState({
              hasLiked: false,
              heartCount: this.state.heartCount -= 1,
            });
          }
        }
      });
    } else {
      this.props.openLoginModal();
    }
  }

  createComment(gems) {
    BackendManager.makeQuery('clips/comment', JSON.stringify({
      clip_id: this.props.match.params.id,
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
    BackendManager.makeQuery('clips/comments/gem/add', JSON.stringify({
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

  renderBottomVideoPlayer() {
    if (this.state.isMobile) {
      return (
        <div>
          <Typography style={textStyleBigMobile}>
            {this.state.clip.title}
          </Typography>
          <Typography style={textStyleSmallMobile}>
            {"Clipped by " + this.state.clip.username}
          </Typography>
          <Row style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
            <div style={{marginRight: 15, cursor: 'pointer'}} onClick={() => this.handleHeartClick()}>
              {this.renderHeart()}
              <p style={{margin: 0, fontSize: 10, textAlign: 'center'}}>{this.getCountStr(this.state.heartCount)}</p>
            </div>
            <button className='button-rounded-green-no-mar-small' style={{ margin: 0 }} data-tip data-for='share_clip' data-event='click'>Share</button>
            <ReactTooltip id='share_clip' place='top' effect='solid' clickable={true}>
              <Row style={{marginLeft: 20}}>
                <TwitterLogin
                  style={{width: 30, height: 30, backgroundColor: '#1DA1F2', cursor: 'pointer', padding: 0}}
                  loginUrl="https://api.mypokadot.com/pp/auth/twitter"
                  onFailure={this.onTwitterAuthFailure}
                  onSuccess={this.onTwitterAuthSuccess}
                  forceLogin={true}
                  requestTokenUrl="https://api.mypokadot.com/pp/auth/twitter/reverse"
                >
                  <img data-tip data-for='twitterTT' style={{width: 20, height: 20}} src='../../../../../images/twitter_icon.png'/>
                </TwitterLogin>
                <ReactTooltip id="twitterTT" place="top" type="light" effect="float">
                  <span>Twitter</span>
                </ReactTooltip>
                <div data-tip data-for='clipboardTT' style={{marginLeft: 10, backgroundColor: '#3ABBBC', width: 30, height: 30, cursor: 'pointer'}} onClick={() => this.copyToClipboard()}>
                  <img style={{width: 30, height: 30}} src='../../../../../images/copy.png'/>
                </div>
                <ReactTooltip id="clipboardTT" place="top" type="light" effect="float">
                  <span>Copy to clipboard</span>
                </ReactTooltip>
              </Row>
              {
                document.queryCommandSupported('copy') &&
                <input ref={this.copyRef} type='text' value={'https://theopenmic.fm/clips/' + this.state.clip.id} style={{width: 100, marginTop: 10}} />
              }
            </ReactTooltip>
          </Row>
          {this.renderAbout()}
        </div>
      );
    } else {
      return (
        <div>
          <Typography style={textStyleBig}>
            {this.state.clip.title}
          </Typography>
          <Typography style={textStyleSmall}>
            {"Clipped by " + this.state.clip.username}
          </Typography>
          <Row style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
            <div style={{marginRight: 15, cursor: 'pointer'}} onClick={() => this.handleHeartClick()}>
              {this.renderHeart()}
              <p style={{margin: 0, fontSize: 15, textAlign: 'center'}}>{this.getCountStr(this.state.heartCount)}</p>
            </div>
            <button className='button-rounded-green-no-mar' style={{ margin: 0 }} data-tip data-for='share_clip' data-event='click'>Share</button>
            <ReactTooltip id='share_clip' place='top' effect='solid' clickable={true}>
              <Row style={{marginLeft: 20}}>
                <TwitterLogin
                  style={{width: 30, height: 30, backgroundColor: '#1DA1F2', cursor: 'pointer', padding: 0}}
                  loginUrl="https://api.mypokadot.com/pp/auth/twitter"
                  onFailure={this.onTwitterAuthFailure}
                  onSuccess={this.onTwitterAuthSuccess}
                  forceLogin={true}
                  requestTokenUrl="https://api.mypokadot.com/pp/auth/twitter/reverse"
                >
                  <img data-tip data-for='twitterTT' style={{width: 20, height: 20}} src='../../../../../images/twitter_icon.png'/>
                </TwitterLogin>
                <ReactTooltip id="twitterTT" place="top" type="light" effect="float">
                  <span>Twitter</span>
                </ReactTooltip>
                <div data-tip data-for='clipboardTT' style={{marginLeft: 10, backgroundColor: '#3ABBBC', width: 30, height: 30, cursor: 'pointer'}} onClick={() => this.copyToClipboard()}>
                  <img style={{width: 30, height: 30}} src='../../../../../images/copy.png'/>
                </div>
                <ReactTooltip id="clipboardTT" place="top" type="light" effect="float">
                  <span>Copy to clipboard</span>
                </ReactTooltip>
              </Row>
              {
                document.queryCommandSupported('copy') &&
                <input ref={this.copyRef} type='text' value={'https://theopenmic.fm/clips/' + this.state.clip.id} style={{width: 100, marginTop: 10}} />
              }
            </ReactTooltip>
          </Row>
          {this.renderAbout()}
        </div>
      );
    }
  }

  renderTopView() {
    if (this.state.clip != null) {
      if (this.state.isMobile) {
        return (
          <div style={{width: '100%', height: 70, backgroundColor: '#f2f2f2'}}>
            <Row>
              <Col>
                <div style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/story/' + this.state.clip.story_id)}>
                  <Row>
                    <Avatar src={this.state.clip.profile_picture} style={{marginBottom: 10, marginLeft: 30, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} />
                    <Col>
                      <div style={centerVertical}>
                        <Typography style={topPanelText}>
                          {"Listen to full Podcast: " + this.state.clip.story_title}
                        </Typography>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col>
                <img
                  style={{height: 50, width: 50, cursor: 'pointer', marginTop: 10}}
                  src='../../../../../images/create_clip_small.png'
                  onClick={() => this.props.history.push('/story/' + this.state.clip.story_id)}
                  />
              </Col>
            </Row>
          </div>
        );
      } else {
        return (
          <div style={{width: '100%', height: 70, backgroundColor: '#f2f2f2'}}>
            <Row>
              <Col md={9}>
                <div style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/story/' + this.state.clip.story_id)}>
                  <Row>
                    <Avatar src={this.state.clip.profile_picture} style={{marginBottom: 10, marginLeft: 30, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} />
                    <Col>
                      <div style={centerVertical}>
                        <Typography style={topPanelText}>
                          {"Listen to full Podcast: " + this.state.clip.story_title}
                        </Typography>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={3}>
                <img
                  style={{height: 40, cursor: 'pointer', marginTop: 15}}
                  src='../../../../../images/create_clip.png'
                  onClick={() => this.props.history.push('/story/' + this.state.clip.story_id)}
                  />
              </Col>
            </Row>
          </div>
        );
      }
    }
  }

  handleCommentChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleSendClick() {
    BackendManager.makeQuery('clips/comment', JSON.stringify({
      clip_id: this.props.match.params.id,
      user_id: UserManager.id,
      comment: this.state.comment,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          comment: "",
        });
        BackendManager.makeQuery('clips/comments', JSON.stringify({
          clip_id: this.props.match.params.id,
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
              }
            }
            this.setState({
              comments: comments,
            });
          }
        });
      }
    });
  }

  renderView() {
    if (this.state.clip != null) {
      return (
        <div>
          <Row>
            <Col md={8}>
              {this.renderVideoPlayer()}
              <Row>
                <TextField
                  label={"Chat with " + this.state.clip.creator_first_name + " " + this.state.clip.creator_last_name}
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
              <Comments
                isLoggedIn={this.props.isLoggedIn}
                openLoginModal={this.props.openLoginModal}
                isChild={false}
                comments={this.state.comments}
                sendReply={this.sendReply}
                openContributeGemsModal={this.openContributeGemsModal}
                setContributorsCommentId={this.setContributorsCommentId}
              />
            </Col>
            <Col md={4}>
              {this.renderRightPanel()}
            </Col>
          </Row>
        </div>
      );
    }
  }

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  renderOtherClipsListItem(item) {
    return (
      <div>
        <ClipItem id={item.id} url={item.url} title={item.title} podcast={item.story_title} name={item.username} handleClipClick={this.handleClipClick}/>
        <Divider />
      </div>
    );
  }

  renderRightPanel() {
    if (this.state.otherClips.length > 0) {
      return (
        <div style={{marginTop: 20, marginRight: 20, marginBottom: 20}}>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            <div>
              <div style={{height: 5}}/>
              <Typography style={rightPanelText}>
                {"Other clips!"}
              </Typography>
              <ul>
                {this.state.otherClips.map((item) => {
                  return (this.renderOtherClipsListItem(item))
                })}
              </ul>
              <div style={{paddingBottom: 10}}>
              </div>
            </div>
          </Paper>
        </div>
      );
    } else {
      return (
        <div style={{marginTop: 20, marginRight: 20, marginBottom: 20}}>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            <div>
              <div style={{height: 5}}/>
              <Typography style={rightPanelText}>
                {"Other clips!"}
              </Typography>
              <button className='button-rounded-purple-no-mar-small' style={{height: 50, cursor: 'pointer', marginTop: 15, width: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} onClick={() => this.props.history.push('/story/' + this.state.clip.story_id)}>Listen to full podcast</button>
              <div style={{paddingBottom: 10}}>
              </div>
            </div>
          </Paper>
        </div>
      );
    }
  }

  copyToClipboard() {
    this.copyRef.current.select();
    document.execCommand('copy');
    this.props.showToast('Copied!');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    // e.target.focus();
    // setCopySuccess('Copied!');
  }

  onTwitterAuthFailure(error) {
    alert(error);
  }

  onTwitterAuthSuccess(response) {
    response.json().then(body => {
      localStorage.setItem('oauth_token', body.data.oauth_token);
      localStorage.setItem('oauth_token_secret', body.data.oauth_token_secret);
      localStorage.setItem('screen_name', body.data.screen_name);
      if (this.state.clip != null) {
        localStorage.setItem('clip_url', this.state.clip.url);
        localStorage.setItem('clip_title', this.state.clip.title);
        localStorage.setItem('clip_id', this.state.clip.id);
      }
      window.open('/share/t');
    });
  }

  sendReply(comment, parentCommentId, rootCommentId) {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('clips/reply', JSON.stringify({
        clip_id: this.props.match.params.id,
        comment: comment,
        parent_comment_id: parentCommentId,
        root_comment_id: rootCommentId,
        user_id: UserManager.id,
      }))
      .then(data => {
        if (data.success) {
          this.refreshComments();
        }
      });
    } else {
      this.props.openLoginModal();
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
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
        {this.renderTopView()}
        {this.renderView()}
      </div>
    )
  }
}

export default ClipPage;
