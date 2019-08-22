import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import TwitterLogin from './components/TwitterLogin.js';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import { Row, Col } from 'react-grid-system';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ClipItem from './components/ClipItem.js';
import Comments from '../../sections/Comments.js';
import ContributeGemsModal from './components/ContributeGemsModal.js';
import ContributorsModal from './components/ContributorsModal.js';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import BrokenPageSection from '../../sections/BrokenPageSection.js';

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

const textFieldStyle = {
  color: "#222225",
  marginTop: 10,
  marginLeft: 50,
  width: 'calc(100% - 200px)',
  marginRight: 20,
}

const styles = {
  textFieldInputRoot: {
    fontFamily: "Lato",
  },
  textFieldLabelRoot: {
    fontFamily: "Lato",
  }
};

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
  color: '#FFFFFF',
  fontFamily: 'Lato',
  textAlign: 'center',
	marginRight: 10,
  fontSize: 20,
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
  color: 'white',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 20,
  marginRight: 20,
	whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const textStyleSmall = {
  color: 'white',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 15,
  marginRight: 20,
	whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

class ClipPage extends Component {

  componentDidMount() {
		if (UserManager.id <= 0) {
			var id = localStorage.getItem('id');
			if (id != null) {
				UserManager.id = id;
			}
		}
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.refreshClip();
  }

  componentDidUpdate() {
    if (this.state.clip == null || this.props.match.params.id != this.state.clip.uuid) {
      this.refreshClip();
    }
  }

  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
    this.state = {
			show404: false,
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
			completedComments: [],
      comment: "",
      currentComment: null,
      contributorsCommentId: 0,
      viewContributorsIsOpen: false,
			currentResponseId: 0,
			hasReceivedDeal: false,
    };

		this.refreshClip = this.refreshClip.bind(this);
    this.refreshComments = this.refreshComments.bind(this);
    this.fetchReplies = this.fetchReplies.bind(this);
		this.fetchResponse = this.fetchResponse.bind(this);
		this.fetchDeals = this.fetchDeals.bind(this);
    this.openContributeGemsModal = this.openContributeGemsModal.bind(this);
		this.closeContributeGemsModal = this.closeContributeGemsModal.bind(this);
		this.renderProgressStr = this.renderProgressStr.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleScrubberMove = this.handleScrubberMove.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.renderClipView = this.renderClipView.bind(this);
		this.renderSlider = this.renderSlider.bind(this);
		this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
    this.onTwitterAuthSuccess = this.onTwitterAuthSuccess.bind(this);
    this.onTwitterAuthFailure = this.onTwitterAuthFailure.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.replay = this.replay.bind(this);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
    this.renderBottomVideoPlayer = this.renderBottomVideoPlayer.bind(this);
		this.renderShareButton = this.renderShareButton.bind(this);
		this.renderRightPanelContent = this.renderRightPanelContent.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderOtherClipsListItem = this.renderOtherClipsListItem.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.createComment = this.createComment.bind(this);
    this.contributeGems = this.contributeGems.bind(this);
    this.setContributorsCommentId = this.setContributorsCommentId.bind(this);
    this.closeViewContributorsModal = this.closeViewContributorsModal.bind(this);
		this.renderView = this.renderView.bind(this);
		this.handleResponseVideoClick = this.handleResponseVideoClick.bind(this);
		this.handleCollectClick = this.handleCollectClick.bind(this);
  }

	refreshClip() {
		BackendManager.makeQuery('clips/info', JSON.stringify({
      uuid: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					show404: false,
          clip: data.clip,
        });
				var storyId = data.clip.story_id;
        BackendManager.makeQuery('clips/others', JSON.stringify({
          clip_id: data.clip.id,
          user_id: data.clip.creator_id,
        }))
        .then(data => {
          if (data.success) {
						if (data.clips.length > 0) {
							this.setState({
	              otherClips: data.clips,
	            });
						} else {
							BackendManager.makeQuery('clips/all', JSON.stringify({
					    }))
					    .then(data => {
					      if (data.success) {
					        this.setState({
					          otherClips: data.clips,
					        });
					      }
					    });
						}
          }
        });

				this.refreshComments(data.clip.id);
				if (!this.state.hasReceivedDeal) {
					this.setState({
						hasReceivedDeal: true
					});
					this.fetchDeals(storyId);
				}
      } else {
				this.setState({
					show404: true,
				});
			}
    });
	}

	fetchDeals(storyId) {
		BackendManager.makeQuery('sponsors/story', JSON.stringify({
			user_id: UserManager.id,
			story_id: storyId,
		}))
		.then(data => {
			console.log(data);
			if (data.success) {
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

  refreshComments(clipId) {
    BackendManager.makeQuery('clips/comments', JSON.stringify({
      clip_id: clipId,
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

		BackendManager.makeQuery('clips/comments/completed', JSON.stringify({
      clip_id: clipId,
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
            // this.fetchReplies(comment.id, comments, true);
						this.fetchResponse(comment.id);
          }
        }
        this.setState({
          completedComments: comments,
        });
      }
    });
  }

  fetchReplies(commentId, comments, isCompleted) {
    BackendManager.makeQuery('clips/comments/children', JSON.stringify({
      comment_id: commentId,
    }))
    .then(data => {
      if (data.success) {
        var replies = [];
				var index = -1;
        for (var i = 0; i < comments.length; i++) {
          if (comments[i].id == commentId) {
						index = i;
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
		BackendManager.makeQuery('clips/comments/response', JSON.stringify({
      comment_id: commentId,
    }))
    .then(data => {
      if (data.success) {
        console.log(data.comments);
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

	renderProgressStr() {
		return (
			<div>
				<p style={{color: 'white', fontSize: 15}}>{UtilsManager.createMinString(this.state.value) + " / " + UtilsManager.createMinString(this.state.duration)}</p>
			</div>
		);
	}

  renderPlayPause() {
    if (this.state.isFinished) {
      return (
        <div style={{width: 50, height: 50, cursor: 'pointer', zIndex: 20}} onClick={() => this.replay()}>
          <img
            style={{display: 'inline-block', width: 30, height: 30, cursor: 'pointer', top: '50%'}}
            src='../../../../../images/replay.png'
            />
					{this.renderProgressStr()}
        </div>
      );
    } else {
			var src = '../../../../../images/play_simple.png';
      if (this.state.isPlaying) {
				src = '../../../../../images/pause_simple.png';
      }
			return (
				<Row>
					<div style={{marginTop: 5, width: 50, height: 50, cursor: 'pointer', zIndex: 20}} onClick={() => this.togglePlayPause()}>
						<img
							style={{width: 30, height: 30, cursor: 'pointer'}}
							src={src}
							/>
					</div>
					{this.renderProgressStr()}
				</Row>
			);
    }
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

  renderVideoPlayer() {
		var width = '70%';
		if (this.state.isMobile) {
			width = '50%';
		}
    return (
      <div>
        <div style={{marginTop: 20, marginLeft: 20, marginRight: 20, height: 160, backgroundColor: '#232831'}}>
					<div style={{display: 'inline-block', height: 160, width: 160}}>
						<img style={{height: 160, width: 160, objectFit: 'cover'}} src={this.state.clip.thumbnail_url}/>
					</div>
					<div style={{display: 'inline-block', marginLeft: 25, marginRight: 20, width: width}}>
						<Typography style={textStyleBig}>
							{this.state.clip.title}
						</Typography>
						<Typography style={textStyleSmall}>
							{"Clipped by " + this.state.clip.username}
						</Typography>
						{this.renderSlider()}
						<div style={{padding: 5}}>
							{this.renderPlayPause()}
						</div>
					</div>
        </div>
				<div>
					<ReactPlayer
						ref={this.ref}
						width={0}
						height={0}
						style={{display: 'hidden'}}
						progressInterval={10}
						url={this.state.clip.url}
						onProgress={this.handleVideoProgress}
						onDuration={this.handleDurationChange}
						playing={this.state.isPlaying} />
				</div>
      </div>
    );
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
		if (this.state.clip) {
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

  createComment(gems) {
    BackendManager.makeQuery('clips/comment', JSON.stringify({
      clip_id: this.state.clip.id,
      user_id: UserManager.id,
      comment: this.state.comment,
    }))
    .then(data => {
      if (data.success) {
				this.setState({
					comment: ""
				});
        this.contributeGems(data.id, gems, this.state.comment)
      }
    });
  }

  contributeGems(commentId, gems, comment) {
    this.closeContributeGemsModal();
    BackendManager.makeQuery('clips/comments/gem/add', JSON.stringify({
      comment_id: commentId,
      user_id: UserManager.id,
      gems: gems,
			comment: comment,
			creator_email: this.state.clip.creator_email,
			uuid: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        this.refreshComments(this.state.clip.id);
        BackendManager.makeQuery('gems/user/update', JSON.stringify({
          gem_count: (-1 * gems),
          user_id: UserManager.id,
        }))
        .then(data => {
          if (data.success) {
						this.setState({
	            comment: "",
	          });
						var text = "You just contributed " + gems + " Gems!";
						this.props.refreshGems();
	          this.props.openGemGifModal(gems, text);
          }
        });
      }
    });
  }

	renderShareButton() {
		if (this.state.isMobile) {
			return (
				<img style={{ margin: 10, width: 30, height: 30, cursor: 'pointer' }} src='../../../../../images/share_icon.png'/>
			);
		} else {
			return (
				<button className='button-rounded-green-no-mar' style={{ margin: 0 }} data-tip data-for='share_clip' data-event='click'>Share</button>
			);
		}
	}

  renderBottomVideoPlayer() {
		return (
			<div>
				<Row>
					<div>
						<Typography style={textStyleBig}>
							{this.state.clip.title}
						</Typography>
						<Typography style={textStyleSmall}>
							{"Clipped by " + this.state.clip.username}
						</Typography>
					</div>
					<div style={{marginTop: 10, marginLeft: 'auto', marginRight: 20}}>
						{this.renderShareButton()}
					</div>
				</Row>
			</div>
		);
  }

  handleCommentChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleSendClick() {
    BackendManager.makeQuery('clips/comment', JSON.stringify({
      clip_id: this.state.clip.id,
      user_id: UserManager.id,
      comment: this.state.comment,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          comment: "",
        });
        BackendManager.makeQuery('clips/comments', JSON.stringify({
          clip_id: this.state.clip.id,
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

  renderClipView(classes) {
		var textFieldWidth = '100%';
		if (this.state.isMobile) {
			textFieldWidth = '95%';
		}
    if (this.state.clip != null) {
      return (
        <div>
          <Row>
            <Col md={8}>
              {this.renderVideoPlayer()}
							<div style={{marginLeft: 20, marginRight: 20}}>
								<TextField
									label={"Chat with " + this.state.clip.creator_first_name + " " + this.state.clip.creator_last_name}
									id="outlined-adornment-amount"
									placeholder="What do you want to say?"
									fullWidth
									multiline
									rows="2"
									InputProps={{ classes: { root: classes.textFieldInputRoot } }}
									InputLabelProps={{
										FormLabelClasses: {
											root: classes.textFieldLabelRoot
										}
									}}
									variant="outlined"
									margin="normal"
									value={this.state.name}
									onChange={this.handleCommentChange} />
								<div style={{float: 'right'}}>
									<button className='button-rounded-green-no-mar-small' onClick={() => this.openContributeGemsModal(null)}>
										{"Send"}
									</button>
								</div>
							</div>
              <Comments
                isLoggedIn={this.props.isLoggedIn}
								isOwner={this.state.clip.creator_id == UserManager.id}
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
								isOwner={this.state.clip.creator_id == UserManager.id}
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
            </Col>
            <Col md={4}>
              {this.renderRightPanel()}
            </Col>
          </Row>
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

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  renderOtherClipsListItem(item) {
    return (
      <div>
        <ClipItem
					id={item.uuid}
					url={item.url}
					title={item.title}
					podcast={item.story_title}
					name={item.username}
					thumbnail={item.thumbnail_url}
					duration={item.duration}
					handleClipClick={this.handleClipClick}
				/>
        <Divider />
      </div>
    );
  }

	renderRightPanelContent(hasClips) {
		var marginLeft = 0;
		if (this.state.isMobile) {
			marginLeft = 20;
		}

		if (hasClips) {
			return (
				<div style={{marginLeft: marginLeft, marginTop: 20, marginRight: 20, marginBottom: 20}}>
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
		}
	}

  renderRightPanel() {
		var marginLeft = 0;
		if (this.state.isMobile) {
			marginLeft = 20;
		}

		return (
			<div>
				<div style={{marginTop: 20, marginLeft: marginLeft, marginRight: 20}}>
					<Paper elevation={1} style={{backgroundColor: '#6175E0'}}>
						<div style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/story/' + this.state.clip.story_uuid)}>
							<Row>
								<Avatar src={this.state.clip.profile_picture} style={{marginBottom: 10, marginLeft: 30, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} />
								<Col>
									<div style={centerVertical}>
										<Typography style={topPanelText}>
											{"Listen to full podcast"}
										</Typography>
									</div>
								</Col>
							</Row>
						</div>
					</Paper>
				</div>
				{this.renderRightPanelContent(this.state.otherClips.length > 0)}
			</div>
		);
  }

  copyToClipboard() {
    this.copyRef.current.select();
    document.execCommand('copy');
    this.props.showToast('Copied!', 'custom');
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

  sendReply(comment, parentCommentId, parentComment, rootCommentId) {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('clips/reply', JSON.stringify({
        clip_id: this.state.clip.id,
        comment: comment,
        parent_comment_id: parentCommentId,
				parent_comment: parentComment,
        root_comment_id: rootCommentId,
        user_id: UserManager.id,
				uuid: this.props.match.params.id,
      }))
      .then(data => {
        if (data.success) {
          this.refreshComments(this.state.clip.id);
        }
      });
    } else {
      this.props.openLoginModal();
    }
  }

	handleCollectClick(commentId, username, comment, gems) {
		BackendManager.makeQuery('notifications/collect', JSON.stringify({
			id: this.state.clip.id,
			comment: comment,
			user_id: this.state.clip.creator_id,
			username: username,
			comment_id: commentId,
			type: 'clip',
			gems: gems,
		}));
	}

	renderView(classes) {
		if (this.state.show404) {
			return (
				<BrokenPageSection />
			);
		} else {
			var modalStyle = customStyles;
			if (this.state.isMobile) {
				modalStyle = customStylesMobile;
			}
			return (
				<div>
	        <Modal
	          isOpen={this.state.contributeGemsIsOpen}
	          style={modalStyle}
	          onRequestClose={this.closeContributeGemsModal}
	          contentLabel="Contribute Gems"
	        >
					{this.state.clip ?
						<ContributeGemsModal
							name={this.state.clip.creator_first_name + " " + this.state.clip.creator_last_name}
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
	          style={modalStyle}
	          onRequestClose={this.closeViewContributorsModal}
	          contentLabel="Contribute Gems"
	        >
	          <ContributorsModal commentId={this.state.contributorsCommentId}/>
	        </Modal>
	        {this.renderClipView(classes)}
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

export default withStyles(styles)(ClipPage);
