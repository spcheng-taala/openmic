import React, { Component, useRef } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import WaveSurfer from 'wavesurfer.js';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';
import Modal from 'react-modal';
import classNames from 'classnames';
import ReactPlayer from 'react-player';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import BrokenPageSection from '../../sections/BrokenPageSection.js';
import Comments from '../../sections/Comments.js';
import ClipItem from './components/ClipItem.js';
import ContributeGemsModal from './components/ContributeGemsModal.js';
import ContributorsModal from './components/ContributorsModal.js';

// some track meta information
var wavesurfer = null;

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
    backgroundColor: 'rgba(19, 18, 24, 0)',
		maxHeight: '100%',
    overflowY: 'auto',
    border: 'none',
  },
  content: {
    top: '35%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		background: 'rgba(255, 255, 255, 0)',
    maxHeight: '80%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
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
		width: '50%',
    transform: 'translate(-50%, -50%)'
  },
};

const customStylesMobile = {
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
		width: '80%',
    transform: 'translate(-50%, -50%)'
  },
};

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: "Lato",
  },
  textFieldLabelRoot: {
    fontFamily: "Lato",
  }
});

const containerStyle = {
  marginLeft: 20,
  marginTop: 20,
  marginBottom: 300,
}

const storyImgStyle = {
  height: 200,
}

const storyPaperStyle = {
  width: '100%',
  marginBottom: 10,
  backgroundColor: "#7E8C9B",
}

const storyTitleStyle = {
  paddingLeft: 20,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 40,
}

const storyTextStyle = {
  paddingLeft: 20,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 30,
  textDecoration: "underline",
}

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

const textFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
  marginLeft: 30,
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
  marginBottom: 10,
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

const sliderStyle = {  // Give the slider some width
  position: 'relative',
  width: '100%',
  height: 60,
}

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: '#8B9CB6',
}

export function Handle({ // your handle component
  handle: { id, value, percent },
  getHandleProps
}) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#2C4870',
        color: '#333',
      }}
      {...getHandleProps(id)}
    >
    </div>
  )
}

function Track({ source, target, getTrackProps }) { // your own track component
  return (
    <div
      style={{
        position: 'absolute',
        height: 10,
        zIndex: 1,
        marginTop: 35,
        backgroundColor: '#546C91',
        borderRadius: 5,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  )
}

class StoryPage extends Component {

  componentDidMount() {
    if (UserManager.id <= 0) {
			var id = localStorage.getItem('id');
			if (id != null) {
				UserManager.id = id;
			}
		}
    window.scrollTo(0, 0);
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    BackendManager.makeQuery('public/stories', JSON.stringify({
      uuid: this.props.match.params.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          show404: false,
          story: data.story
        });

        if (!this.state.hasReceivedDeal) {
          this.setState({
            hasReceivedDeal: true
          });
          this.fetchDeals(data.story.id);
        }

        if (data.story.type == 0) {
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
          wavesurfer.load(data.story.url);
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
        }

        BackendManager.makeQuery('clips/story', JSON.stringify({
          story_id: this.state.story.id,
        }))
        .then(data => {
          if (data.success) {
            console.log(data.clips);
            this.setState({
    					clips: data.clips,
            });
          }
        });

        this.refreshComments();
      } else {
        this.setState({
          show404: true
        });
      }
    });
  }

  componentWillUnmount() {
    if (wavesurfer != null) {
      if (wavesurfer.isPlaying()) {
        wavesurfer.stop();
      }
    }
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
      show404: false,
      duration: 0,
      story: null,
      comment: "",
      comments: [],
      completedComments: [],
      isMobile: false,
      clips: [],
      isPlaying: false,
      currentResponseId: 0,
      currentTime: 0,
      contributeGemsIsOpen: false,
      viewContributorsIsOpen: false,
      currentComment: null,
      contributorsCommentId: 0,
      value: 0,
      scrubberShouldMove: true,
      isFinished: false,
      hasReceivedDeal: false,
    };

    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.renderFollowButton = this.renderFollowButton.bind(this);
    this.setFollowing = this.setFollowing.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.openContributeGemsModal = this.openContributeGemsModal.bind(this);
		this.closeContributeGemsModal = this.closeContributeGemsModal.bind(this);
    this.setContributorsCommentId = this.setContributorsCommentId.bind(this);
    this.closeViewContributorsModal = this.closeViewContributorsModal.bind(this);

    this.fetchDeals = this.fetchDeals.bind(this);
    this.refreshComments = this.refreshComments.bind(this);
    this.renderRightPanelContent = this.renderRightPanelContent.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderClipsListItem = this.renderClipsListItem.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
    this.createComment = this.createComment.bind(this);
    this.contributeGems = this.contributeGems.bind(this);
    this.fetchReplies = this.fetchReplies.bind(this);
    this.fetchResponse = this.fetchResponse.bind(this);
    this.openClip = this.openClip.bind(this);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
    this.renderProgressStr = this.renderProgressStr.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.renderSlider = this.renderSlider.bind(this);
    this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleScrubberMove = this.handleScrubberMove.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.renderPodcastView = this.renderPodcastView.bind(this);
    this.renderView = this.renderView.bind(this);
    this.handleResponseVideoClick = this.handleResponseVideoClick.bind(this);
    this.handleCollectClick = this.handleCollectClick.bind(this);
  }

  ref = player => {
    this.player = player
  }

  renderPodcastView() {
    if (this.state.story) {
      if (this.state.story.type == 0) {
        return (
          <div>
            <CardActionArea style={storyContainerStyle}>
              <Paper style={storyPaperStyle}>
                <Container style={{marginTop: 10, position: "absolute", zIndex: 1, backgroundColor: "transparent"}}>
                  <Row>
                    {this.renderPlayPause()}
                    <div>
                      {this.state.story ?
                      <Typography style={storyTitleStyle}>
                        {this.state.story.title}
                      </Typography> : <div />}
                    </div>
                  </Row>
                </Container>
              </Paper>
            </CardActionArea>
            <div id="waveform" style={{ margin: 50 }}></div>
          </div>
        );
      } else {
        return (
          <div>
            {this.renderVideoPlayer()}
          </div>
        );
      }
    }
  }

  renderVideoPlayer() {
    return (
      <div>
        <div style={{margin: 20}}>
          <div style={{backgroundColor: '#0F0D12'}}>
            <div style={root}>
              <ReactPlayer
                ref={this.ref}
                style={{marginTop: 20}}
                progressInterval={10}
                url={this.state.story.url}
                onProgress={this.handleVideoProgress}
                onDuration={this.handleDurationChange}
                playing={this.state.isPlaying} />
            </div>
            <div style={{marginTop: 20, marginRight: 25, marginLeft: 25}}>
              {this.renderSlider()}
            </div>
            {this.renderPlayPause()}
          </div>
        </div>
      </div>
    );
  }

  handleVideoProgress(state) {
    this.setState({
      value: state.playedSeconds,
    });

    if (state.playedSeconds == this.state.duration) {
      this.setState({
        isPlaying: false,
        isFinished: true,
        value: 0,
      });
    }
  }

  handleSlideStart() {
		this.setState({
			isPlaying: false,
		});
	}

	handleSlideEnd(state) {
		if (state.length == 1) {
			this.setState({
				value: state[0],
				isPlaying: true,
			});
		}

		if (this.state.value < 1) {
			var percentage = this.state.value / this.state.duration;
			this.player.seekTo(percentage);
		} else {
			this.player.seekTo(this.state.value);
		}
	}

  renderSlider() {
		if (this.state.story) {
			return (
				<div>
					<Slider
						rootStyle={sliderStyle}
						domain={[0, this.state.duration]}
						step={0.01}
						mode={1}
						onSlideStart={this.handleSlideStart}
						onSlideEnd={this.handleSlideEnd}
						values={[this.state.value]}
					>
						<div style={railStyle} />
						<Handles>
							{({ handles, getHandleProps }) => (
								<div className="slider-handles">
									{handles.map(handle => (
										<Handle
											key={handle.id}
											handle={handle}
											getHandleProps={getHandleProps}
										/>
									))}
								</div>
							)}
						</Handles>
						<Tracks left={false} right={false}>
							{({ tracks, getTrackProps }) => (
								<div className="slider-tracks">
									{tracks.map(({ id, source, target }) => (
										<Track
											key={id}
											source={source}
											target={target}
											getTrackProps={getTrackProps}
										/>
									))}
								</div>
							)}
						</Tracks>
					</Slider>
				</div>
			);
		}
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

  fetchDeals(storyId) {
		BackendManager.makeQuery('sponsors/story', JSON.stringify({
			story_id: storyId,
      user_id: UserManager.id,
		}))
		.then(data => {
			if (data.success) {
        console.log(data);
        if (data.sponsors.length > 0) {
					if (this.props.isLoggedIn) {
						var sponsors = [];
						for (var i = 0; i < data.sponsors.length; i++) {
							var sponsor = {
								user_id: UserManager.id,
								sponsor_id: data.sponsors[i].sponsor_id,
								story_id: storyId,
							}
							sponsors.push(sponsor);
						}
						BackendManager.makeQuery('sponsors/update', JSON.stringify({
							sponsors: sponsors,
						}));
					}	else {
						var sponsorsJson = localStorage.getItem('sponsors');
						var sponsors = [];
						if (sponsorsJson) {
							var json = JSON.parse(sponsorsJson);
							sponsors = json.sponsors;
						}
						for (var i = 0; i < data.sponsors.length; i++) {
							sponsors.push(data.sponsors[i]);
						}
						var s = {
							sponsors: sponsors,
						};
						localStorage.setItem('sponsors', JSON.stringify(s));
					}
					this.props.showToast('Congrats! You just earned some new deals! Click the gift icon to see them.', 'custom');
					this.props.setNotification(true);
				}
			}
		});
	}

  refreshComments() {
    if (this.state.story) {
      BackendManager.makeQuery('stories/comments', JSON.stringify({
        story_id: this.state.story.id,
      }))
      .then(data => {
        if (data.success) {
          var comments = [];
          for (var i = 0; i < data.comments.length; i++) {
            var comment = data.comments[i];
            comment.children = [];
            if (comment.sum == null) {
              comment.sum = 0;
            }
            if (comment.id != null) {
              comments.push(comment);
              this.fetchReplies(comment.id, comments, false);
            }
          }
          this.setState({
            comments: comments,
          });
        }
      });

      BackendManager.makeQuery('stories/comments/completed', JSON.stringify({
        story_id: this.state.story.id,
      }))
      .then(data => {
        if (data.success) {
          var comments = [];
          for (var i = 0; i < data.comments.length; i++) {
            var comment = data.comments[i];
            comment.children = [];
            if (comment.sum == null) {
              comment.sum = 0;
            }
            if (comment.id != null) {
              comments.push(comment);
              this.fetchReplies(comment.id, comments, true);
              this.fetchResponse(comment.id);
            }
          }
          this.setState({
            completedComments: comments,
          });
        }
      });
    }
  }

  fetchReplies(commentId, comments, isCompleted) {
    BackendManager.makeQuery('stories/comments/children', JSON.stringify({
      comment_id: commentId,
    }))
    .then(data => {
      if (data.success) {
        var replies = [];
        var index = -1;
        for (var i = 0; i < comments.length; i++) {
          index = i;
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

        if (replies.length > 0 && index >= 0) {
					replies = UtilsManager.buildHierarchy(replies, commentId);
					comments[index].children = replies;
				}

        if (isCompleted) {
					this.setState({
						completedComments: comments,
	        });
				} else {
					this.setState({
	          comments: comments,
	        });
				}
      }
    });
  }

  fetchResponse(commentId) {
    BackendManager.makeQuery('stories/comments/response', JSON.stringify({
      comment_id: commentId,
    }))
    .then(data => {
      if (data.success) {
        var comments = this.state.completedComments;
        for (var i = 0; i < comments.length; i++) {
          if (comments[i].id == commentId) {
            comments[i].response = data.response;
          }
        }
        this.setState({
          completedComments: comments,
        });
      }
    });
  }

  togglePlayPause() {
    if (this.state.story) {
      if (this.state.story.type == 0) {
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
      } else {
        var isPlaying = !this.state.isPlaying;
        this.setState({
          isPlaying: isPlaying,
        });
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
    if (this.state.story) {
      return (
        <div>
          <Comments
            isLoggedIn={this.props.isLoggedIn}
            isOwner={this.state.story.user_id == UserManager.id}
            openLoginModal={this.props.openLoginModal}
            isChild={false}
            comments={this.state.comments}
            sendReply={this.sendReply}
            currentResponseId={this.state.currentResponseId}
            openContributeGemsModal={this.openContributeGemsModal}
            setContributorsCommentId={this.setContributorsCommentId}
            handleResponseVideoClick={this.handleResponseVideoClick}
            handleCollectClick={this.handleCollectClick}
            depth={1}
          />
          <Comments
            isLoggedIn={this.props.isLoggedIn}
            isOwner={this.state.story.user_id == UserManager.id}
            openLoginModal={this.props.openLoginModal}
            isChild={false}
            comments={this.state.completedComments}
            sendReply={this.sendReply}
            currentResponseId={this.state.currentResponseId}
            openContributeGemsModal={this.openContributeGemsModal}
            setContributorsCommentId={this.setContributorsCommentId}
            handleResponseVideoClick={this.handleResponseVideoClick}
            handleCollectClick={this.handleCollectClick}
            depth={1}
          />
        </div>
      );
    }
  }

  handleResponseVideoClick(id) {
		if (this.state.currentResponseId != id) {
			this.setState({
				currentResponseId: id
			});
		} else {
			this.setState({
				currentResponseId: 0
			});
		}
	}

  handleSendClick() {
    if (this.props.isLoggedIn) {
      if (this.state.story) {
        BackendManager.makeQuery('public/comments/create', JSON.stringify({
          donation: 0,
          story_id: this.state.story.id,
          name: UserManager.firstName + " " + UserManager.lastName,
          email: UserManager.email,
          comment: this.state.comment,
          title: this.state.story.title,
        }))
        .then(data => {
          if (data.success) {
            this.props.showToast("Sent!", 'custom');
            this.props.fetchComments(this.state.story.id);
            this.setState({
              comment: "",
            });
          }
        });
      }
    }
  }

  sendReply(reply, parentCommentId, parentComment, rootCommentId) {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('stories/comments/reply', JSON.stringify({
        story_id: this.props.match.params.id,
        user_id: UserManager.id,
        parent_comment_id: parentCommentId,
        parent_comment: parentComment,
        root_comment_id: rootCommentId,
        comment: reply,
        user_id: UserManager.id,
				uuid: this.props.match.params.id,
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

  renderProfile() {
    if (this.state.isMobile) {
      if (this.state.story) {
        return (
          <div>
            <div style={{width: '100%', textAlign: 'center'}}>
              <img style={{display: 'inline-block', height: 200, marginBottom: 20}} src={this.state.story.profile_picture} backgroundColor={'transparent'}/>
            </div>
            <Container>
              <a style={storyTextStyle} onClick={() => this.handleUserClick(this.state.story.user_id)} activeClassName="active">
                {this.state.story.first_name + " " + this.state.story.last_name}
              </a>
              {this.renderFollowButton()}
              <p style={{paddingLeft: 20, flex: 1}}>{this.state.story.bio}</p>
            </Container>
          </div>
        );
      }
    } else {
      if (this.state.story) {
        return (
          <Container style={{marginLeft: 10, marginBottom: 20}}>
            <Row>
              <img style={storyImgStyle} src={this.state.story.profile_picture} backgroundColor={'transparent'}/>
              <Col>
                <div>
                  <a style={storyTextStyle} onClick={() => this.handleUserClick(this.state.story.username)} activeClassName="active">
                    {this.state.story.first_name + " " + this.state.story.last_name}
                  </a>
                  <Row>
                    {this.renderFollowButton()}
                  </Row>
                  <p style={{paddingLeft: 20, flex: 1}}>{this.state.story.bio}</p>
                </div>
              </Col>
            </Row>
          </Container>
        );
      }
    }
  }

  renderFollowButton() {
    if (this.props.isLoggedIn) {
      var isFollowing = false;
      for (var i = 0; i < this.props.following.length; i++) {
        if (this.state.story.user_id == this.props.following[i].id) {
          isFollowing = true;
        }
      }

      if (isFollowing) {
        return (
          <button className='button-rounded-empty-purple-no-mar' style={{marginLeft: 30, marginTop: 20}} onClick={() => this.setFollowing(isFollowing)}>
            {"Unfollow"}
          </button>
        );
      } else {
        return (
          <button className='button-rounded-purple-no-mar' style={{marginLeft: 30, marginTop: 20}} onClick={() => this.setFollowing(isFollowing)}>
            {"Follow"}
          </button>
        );
      }
    } else {
      return (
        <button className='button-rounded-purple-no-mar' style={{marginLeft: 30, marginTop: 20}} onClick={() => this.setFollowing(false)}>
          {"Follow"}
        </button>
      );
    }
  }

  setFollowing(isFollowing) {
    if (this.props.isLoggedIn) {
      this.props.setFollowing(isFollowing, this.state.story.user_id);
    } else {
      this.props.openLoginModal();
    }
  }

  openClip() {
    if (this.state.story && this.state.story.type == 1) {
      this.setState({
        isPlaying: false,
      });
      localStorage.setItem('url', this.state.story.url);
      localStorage.setItem('story_id', this.state.story.id);
      window.open('/editor');
    }
  }  

  renderProgressStr() {
		return (
			<div style={{display: 'inline-block', height: 30}}>
        <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
          <div style={{fontFamily: 'Lato', color: 'white', fontSize: 15, marginTop: 5}}>
            {UtilsManager.createMinString(this.state.value) + " / " + UtilsManager.createMinString(this.state.duration)}
          </div>
        </div>
			</div>
		);
	}

  renderPlayPause() {
    if (this.state.story) {
      if (this.state.story.type == 0) {
        if (this.state.isPlaying) {
          return (
            <img style={playPauseButtonStyle} src='../../../../../images/pause.png' onClick={() => this.togglePlayPause()}/>
          );
        } else {
          return (
            <img style={playPauseButtonStyle} src='../../../../../images/play.png' onClick={() => this.togglePlayPause()}/>
          );
        }
      } else {
        if (this.state.isFinished) {
          return (
            <div style={{width: 50, height: 50, cursor: 'pointer', zIndex: 20}} onClick={() => this.replay()}>
              <img
                style={{marginTop: 10, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
                src='../../../../../images/replay.png'
                />
            </div>
          );
        } else {
          var src = '../../../../../images/play_simple.png';
          if (this.state.isPlaying) {
            src = '../../../../../images/pause_simple.png';
          }

          return (
            <div>
              <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 10, display: 'inline-block'}} onClick={() => this.togglePlayPause()}>
                <img
                  style={{marginLeft: 10, marginTop: 10, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
                  src={src}
                  />
              </div>
              {this.renderProgressStr()}
              <button className='button-purple-small' style={{float: 'right', display: 'inline-block', marginRight: 20}} onClick={() => this.openClip()}>{'Create Clip'}</button>
            </div>
          );
        }
      }
    }
  }

  openContributeGemsModal(comment) {
    if (this.props.isLoggedIn) {
      this.setState({
        contributeGemsIsOpen: true,
        currentComment: comment,
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

  renderRightPanelContent(hasClips) {
    if (hasClips) {
      return (
        <ul>
          {this.state.clips.map((item) => {
            return (this.renderClipsListItem(item))
          })}
        </ul>
      );
    } else {
      return (
        <button className='button-purple' style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} onClick={() => this.openClip()}>{"Create Clip"}</button>
      );
    }
  }

  renderRightPanel() {
    return (
      <div style={{marginTop: 20, marginRight: 20, marginBottom: 20}}>
        <div>
          <div style={{height: 5}}/>
          <Typography style={rightPanelText}>
            {"Clips!"}
          </Typography>
          {this.renderRightPanelContent(this.state.clips.length > 0)}
          <div style={{paddingBottom: 10}}>
          </div>
        </div>
      </div>
    );
  }

  renderClipsListItem(item) {
    return (
      <div>
        <ClipItem
          id={item.uuid}
          url={item.url}
          title={item.title}
          podcast={item.story_title}
          name={item.username}
          thumbnail={item.thumbnail_url}
          handleClipClick={this.handleClipClick}
          duration={item.duration}
        />
        <Divider />
      </div>
    );
  }

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  handleCollectClick(commentId, username, comment, gems) {
		BackendManager.makeQuery('notifications/collect', JSON.stringify({
			id: this.state.story.id,
			comment: comment,
			user_id: this.state.story.user_id,
			username: username,
			comment_id: commentId,
			type: 'story',
			gems: gems,
		}));
	}

  createComment(gems) {
    BackendManager.makeQuery('stories/comment', JSON.stringify({
      story_id: this.state.story.id,
      user_id: UserManager.id,
      comment: this.state.comment,
    }))
    .then(data => {
      if (data.success) {
        this.contributeGems(data.id, gems, this.state.comment)
      }
    });
  }

  contributeGems(commentId, gems, comment) {
    this.closeContributeGemsModal();
    BackendManager.makeQuery('stories/comments/gem/add', JSON.stringify({
      comment_id: commentId,
      comment: comment,
      user_id: UserManager.id,
      gems: gems,
      uuid: this.props.match.params.id,
      creator_email: this.state.story.creator_email,
    }))
    .then(data => {
      if (data.success) {
        this.refreshComments();
        BackendManager.makeQuery('gems/user/update', JSON.stringify({
          gem_count: (-1 * gems),
          user_id: UserManager.id,
        }))
        .then(data => {
          this.setState({
            comment: "",
          });
          var text = "You just contributed " + gems + " Gems!";
          this.props.refreshGems();
          this.props.openGemGifModal(gems, text);
        });
      }
    });
  }

  renderView(classes) {
    if (this.state.show404) {
      return (
        <BrokenPageSection />
      );
    } else {
      var modalStyle = customStyles;
      var textFieldWidth = '100%';
      var marginLeft = 0;
      var marginRight = 0;
      if (this.state.isMobile) {
        modalStyle = customStylesMobile;
        textFieldWidth = '95%';
        marginLeft = 20;
        marginRight = 20;
      }
      return (
        <div style={{backgroundColor: '#F4F3F6'}}>
          <Modal
            isOpen={this.state.contributeGemsIsOpen}
            style={customStyles}
            onRequestClose={this.closeContributeGemsModal}
            contentLabel="Contribute Gems"
          >
            {this.state.story ?
              <ContributeGemsModal
                name={this.state.story.first_name + " " + this.state.story.last_name}
                comment={this.state.currentComment}
                contributeGems={this.contributeGems}
                createComment={this.createComment}
                closeContributeGemsModal={this.closeContributeGemsModal}
                openBuyGemsModal={this.props.openBuyGemsModal}
              /> : <div/>
            }
          </Modal>
          <Modal
            isOpen={this.state.viewContributorsIsOpen}
            style={customStyles}
            onRequestClose={this.closeViewContributorsModal}
            contentLabel="Contribute Gems"
          >
            <ContributorsModal commentId={this.state.contributorsCommentId}/>
          </Modal>
          <div>
            <Row>
              <Col sm={8}>
                <Paper elevation={1} style={{backgroundColor: 'white', marginTop: 20, marginLeft: 20, paddingBottom: 20, marginRight: marginRight}}>
                  {this.renderPodcastView()}
                  {this.renderProfile()}
                </Paper>
                <div style={{width: textFieldWidth, border: '2px solid #4E5CD8', marginLeft: 10, marginTop: 10, paddingBottom: 20, borderRadius: 15}}>
                  <Row style={{marginLeft: 5, marginTop: 10}}>
                    {this.state.story ?
                      <TextField
                        label={"Chat with " + this.state.story.first_name + " " + this.state.story.last_name}
                        id="outlined-adornment-amount"
                        placeholder="What do you want to say?"
                        fullWidth
                        style={textFieldStyle}
                        value={this.state.name}
                        InputProps={{ classes: { root: classes.textFieldInputRoot } }}
    										InputLabelProps={{
    						          FormLabelClasses: {
    						            root: classes.textFieldLabelRoot
    						          }
    						        }}
                        onChange={this.handleCommentChange} /> : <div />}
                    <button className='button-green' onClick={() => this.openContributeGemsModal(0)}>
                      {"Send"}
                    </button>
                  </Row>
                </div>
                {this.renderComments()}
              </Col>
              <Col sm={4}>
                <Paper elevation={1} style={{backgroundColor: 'white', marginLeft: marginLeft, marginRight: 20}}>
                  {this.renderRightPanel()}
                </Paper>
              </Col>
            </Row>
          </div>
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        {this.renderView(classes)}
      </div>
    )
  }
}

export default withStyles(styles)(StoryPage);
