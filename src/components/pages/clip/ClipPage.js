import React, { Component } from 'react';
import { Slider, Handles, Tracks } from 'react-compound-slider';
import ReactPlayer from 'react-player';
import { Row, Col } from 'react-grid-system';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Helmet } from 'react-helmet';
import ClipItem from './components/ClipItem.js';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import BrokenPageSection from '../../sections/BrokenPageSection.js';

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

const buttonText = {
  color: '#FFFFFF',
  fontFamily: 'Lato',
  textAlign: 'center',
	marginRight: 10,
  fontSize: 15,
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

const likeCountTextGrey = {
  color: '#878A8C',
  fontFamily: 'Lato',
  textAlign: 'left',
  fontSize: 17,
  marginTop: 15,
  cursor: 'pointer',
}

const likeCountTextRed = {
  color: '#D14C85',
  fontFamily: 'Lato',
  textAlign: 'left',
  fontSize: 17,
  marginTop: 15,
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
    window.addEventListener("resize", this.resize, false);
    this.resize();
    this.refreshClip();
  }

  componentDidUpdate() {
    if (this.state.clip == null || this.props.match.params.id !== this.state.clip.uuid) {
      this.refreshClip();
    }
  }

  componentWillUnmount() {
		window.removeEventListener('resize', this.resize, false);
	}

  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
    this.state = {
			show404: false,
      isMobile: false,
      clip: null,
      isPlaying: true,
      value: 0,
      duration: 0,
      isFinished: false,
      otherClips: [],
      reaction: 0,
      likeCount: 0,
      genres: [],
    };

    this.resize = this.resize.bind(this);
		this.refreshClip = this.refreshClip.bind(this);
		this.renderProgressStr = this.renderProgressStr.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.renderClipView = this.renderClipView.bind(this);
		this.renderSlider = this.renderSlider.bind(this);
		this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.replay = this.replay.bind(this);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
    this.renderLikeCountText = this.renderLikeCountText.bind(this);
		this.savePodcast = this.savePodcast.bind(this);
    this.renderGenresView = this.renderGenresView.bind(this);
		this.renderRightPanelContent = this.renderRightPanelContent.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderOtherClipsListItem = this.renderOtherClipsListItem.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
		this.renderView = this.renderView.bind(this);
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
          likeCount: data.clip.like_count,
        });
        if (this.props.genre.value.id > 0) {
          BackendManager.makeQuery('clips/genre/trending/other', JSON.stringify({
            clip_id: data.clip.id,
            genre_id: this.props.genre.value.id
          }))
          .then(data => {
            if (data.success) {
  						this.setState({
                otherClips: data.clips
              })
            }
          });
        } else {
          BackendManager.makeQuery('clips/top/other', JSON.stringify({
            clip_id: data.clip.id,
          }))
          .then(data => {
            if (data.success) {
  						this.setState({
                otherClips: data.clips
              })
            }
          });
        }

        BackendManager.makeQuery('clips/reaction', JSON.stringify({
          clip_id: data.clip.id,
          user_id: UserManager.id,
        }))
        .then(data => {
          if (data.success) {
            this.setState({
              reaction: data.reaction,
            });
          }
        });

        BackendManager.makeQuery('genres/clip', JSON.stringify({
          clip_id: data.clip.id,
        }))
        .then(data => {
          if (data.success) {
            this.setState({
              genres: data.genres,
            });
          }
        });
      } else {
				this.setState({
					show404: true,
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
				<Row>
					<div style={{marginTop: 5, width: 50, height: 50, cursor: 'pointer', zIndex: 20}} onClick={() => this.replay()}>
						<img
							alt={"replay"}
							style={{width: 30, height: 30, cursor: 'pointer'}}
							src='../../../../../images/replay.png'
							/>
					</div>
					{this.renderProgressStr()}
				</Row>
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
							alt={"play"}
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

    if (state.playedSeconds === this.state.duration) {
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

  playAtValue(value) {
    this.setState({
      isPlaying: true,
    });
    this.player.seekTo(parseFloat(value));
  }

  renderLikeCountText() {
    return (
      <Row>
        <Typography style={likeCountTextRed}>
          {UtilsManager.createNumberString(this.state.likeCount)}
        </Typography>
        <img src='../../../../../images/heart_filled.png' style={{marginRight: 20, marginLeft: 5, marginTop: 10, width: 35, height: 35, display: 'inline-block'}} />
        <button className='button-purple-small' style={{marginTop: 10}} onClick={() => this.copyToClipboard()}>{'Share'}</button>
        <Col>
          <div style={{marginTop: 10, marginRight: 10}}>
            <Paper elevation={1} style={{backgroundColor: '#6175E0', paddingTop: 10, paddingBottom: 10, width: 220}}>
              <div style={{cursor: 'pointer'}} onClick={() => this.savePodcast()}>
                <Row>
                  <img src='../../../../../images/heart_filled.png' style={{marginLeft: 20, width: 20, height: 20, display: 'inline-block'}} />
                  <Col>
                    <div style={centerVertical}>
                      <Typography style={buttonText}>
                        {"Add episode to playlist"}
                      </Typography>
                    </div>
                  </Col>
                </Row>
              </div>
            </Paper>
          </div>
        </Col>
        {
          document.queryCommandSupported('copy') &&
          <input readOnly ref={this.copyRef} type='text' value={'https://riptide.fm/clips/' + this.props.match.params.id} style={{width: 0, height: 0}} />
        }
      </Row>
    );
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
						<img alt={"thumbnail"} style={{height: 160, width: 160, objectFit: 'cover'}} src={this.state.clip.podcast_thumbnail}/>
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
        <div style={{float: 'right'}}>
          {this.renderLikeCountText()}
        </div>
        {this.renderGenresView()}
      </div>
    );
  }

	handleSlideStart() {
		this.setState({
			isPlaying: false,
		});
	}

	handleSlideEnd(state) {
		if (state.length === 1) {
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

  renderClipView() {
    if (this.state.clip != null) {
      return (
        <div>
          <Helmet>
            <title>{this.state.clip.title}</title>
          </Helmet>
          <Row>
            <Col md={8}>
              {this.renderVideoPlayer()}
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
    window.location.reload();
  }

  renderOtherClipsListItem(item) {
    return (
      <div key={item.id}>
        <ClipItem
					id={item.uuid}
					url={item.url}
					title={item.title}
					podcast={item.story_title}
					name={item.username}
					thumbnail={item.podcast_thumbnail}
          likeCount={item.like_count}
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

	savePodcast() {
		if (this.props.isLoggedIn) {
			BackendManager.makeQuery('podcasts/playlist/check', JSON.stringify({
				user_id: UserManager.id,
				podcast_id: this.state.clip.podcast_id,
			}))
			.then(data => {
				if (data.success) {
					if (data.inPlaylist) {
						this.props.showToast('This episode is already in your playlist!', 'custom');
					} else {
            BackendManager.makeQuery('clips/react', JSON.stringify({
              like: 1,
              clip_id: this.state.clip.id,
            }))
            .then(data => {
              if (data.success) {
                this.setState({
                  likeCount: this.state.likeCount + 1
                });
              }
            });
						BackendManager.makeQuery('podcasts/playlist/add', JSON.stringify({
							user_id: UserManager.id,
							podcast_id: this.state.clip.podcast_id,
							podcast_title: this.state.clip.podcast_title,
							podcast_thumbnail: this.state.clip.podcast_thumbnail,
							podcast_duration: this.state.clip.podcast_duration,
							podcast_url: this.state.clip.podcast_url,
							podcast_description: this.state.clip.podcast_description,
						}))
						.then(data => {
							if (data.success) {
								this.props.showToast('Added!', 'custom');
							}
						});
					}
				}
			});
		} else {
			this.props.openLoginModal();
		}
	}

  renderGenresView() {
    var cols = 5;
    if (this.state.isMobile) {
      cols = 3;
    }
    return (
      <div style={{marginTop: 75, borderRadius: 20, padding: 20, backgroundColor: '#ebe9ef', marginLeft: 20, marginRight: 20}}>
        <p style={{margin: 20, color: '#232831', width: '100%', textAlign: 'center', textSize: 20, fontWeight: 'bold'}}>{"Genres"}</p>
        <div className='grid-root'>
          <GridList cellHeight={50} className='grid-list' cols={cols}>
            {this.state.genres.map(genre => (
              <GridListTile key={genre.id} style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/g/' + encodeURIComponent(genre.name))}>
                <button className='button-rounded-no-mar' style={{background: '#42BCBB'}}>
                  {genre.name}
                </button>
              </GridListTile>
            ))}
          </GridList>
        </div>
      </div>
    );
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
						<div style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/podcast/' + this.state.clip.podcast_id)}>
							<Row>
								<Avatar src={this.state.clip.podcast_thumbnail} style={{marginBottom: 10, marginLeft: 30, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} />
								<Col>
									<div style={centerVertical}>
										<Typography style={topPanelText}>
											{"Listen to full episode"}
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

	renderView() {
		if (this.state.show404) {
			return (
				<BrokenPageSection />
			);
		} else {
			return (
				<div>
	        {this.renderClipView()}
	      </div>
			);
		}
	}

  render() {
		return (
      <div>
				{this.renderView()}
			</div>
    )
  }
}

export default ClipPage;
