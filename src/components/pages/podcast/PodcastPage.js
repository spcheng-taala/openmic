import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';
import ReactPlayer from 'react-player';
import { Row, Col } from 'react-grid-system';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
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

const rightPanelText = {
  color: '#B8B5BE',
  fontFamily: 'Lato',
  textAlign: 'center',
  fontSize: 17,
  marginTop: 20,
  marginBottom: 20,
  marginRight: 10,
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

class PodcastPage extends Component {

  componentDidMount() {
		if (UserManager.id <= 0) {
			var id = localStorage.getItem('id');
			if (id != null) {
				UserManager.id = id;
			}
		}
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.refreshPodcast();
  }

  componentDidUpdate() {
    if (this.state.podcast == null || this.props.match.params.id != this.state.podcast.id) {
      this.refreshPodcast();
    }
  }

  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
    this.state = {
			show404: false,
      isMobile: false,
      podcast: null,
      isPlaying: true,
      value: 0,
      duration: 0,
      isFinished: false,
      otherClips: [],
    };

		this.refreshPodcast = this.refreshPodcast.bind(this);
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
		this.renderRightPanelContent = this.renderRightPanelContent.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderOtherClipsListItem = this.renderOtherClipsListItem.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
		this.renderView = this.renderView.bind(this);
    this.openClip = this.openClip.bind(this);
    this.savePodcast = this.savePodcast.bind(this);
  }

	refreshPodcast() {
		BackendManager.getEpisode(this.props.match.params.id)
    .then(data => {
      const regex = /(<([^>]+)>)/ig;
      if (data.id) {
        var description = data.description.replace(regex, '');
        var podcast = {
          id: data.id,
          audio: data.audio,
          image: data.image,
          title: data.title,
          descrpition: description,
          podcast: data.podcast.title,
          podcastId: data.podcast.id,
          duration: data.audio_length_sec,
        };
        this.setState({
          show404: false,
          podcast: podcast,
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

  playAtValue(value) {
    this.setState({
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
						<img style={{height: 160, width: 160, objectFit: 'cover'}} src={this.state.podcast.image}/>
					</div>
					<div style={{display: 'inline-block', marginLeft: 25, marginRight: 20, width: width}}>
						<Typography style={textStyleBig}>
							{this.state.podcast.title}
						</Typography>
						<Typography style={textStyleSmall}>
							{"From: " + this.state.podcast.title}
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
						url={this.state.podcast.audio}
						onProgress={this.handleVideoProgress}
						onDuration={this.handleDurationChange}
						playing={this.state.isPlaying} />
				</div>
        <button className='button-purple-small' style={{float: 'right', display: 'inline-block', marginRight: 20, marginTop: 10}} onClick={() => this.openClip()}>{'Create Clip'}</button>
      </div>
    );
  }

  openClip() {
    if (this.state.podcast) {
      this.setState({
        isPlaying: false,
      });
      localStorage.setItem('url', this.state.podcast.audio);
      localStorage.setItem('podcast_id', this.props.match.params.id);
      localStorage.setItem('podcast_title', this.state.podcast.title);
      localStorage.setItem('podcast_thumbnail', this.state.podcast.image);
      window.open('/editor');
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
		if (this.state.podcast) {
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

  renderClipView(classes) {
		var textFieldWidth = '100%';
		if (this.state.isMobile) {
			textFieldWidth = '95%';
		}
    if (this.state.podcast != null) {
      return (
        <div>
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
            <div style={{cursor: 'pointer'}} onClick={() => this.savePodcast()}>
              <Row>
                <Avatar src={this.state.podcast.image} style={{marginBottom: 10, marginLeft: 30, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} />
                <Col>
                  <div style={centerVertical}>
                    <Typography style={topPanelText}>
                      {"Save Podcast For Later"}
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

  savePodcast() {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('podcasts/playlist/check', JSON.stringify({
        user_id: UserManager.id,
        podcast_id: this.state.podcast.id,
      }))
      .then(data => {
        console.log(data);
        if (data.success) {
          if (data.inPlaylist) {
            this.props.showToast('This podcast is already in your playlist!', 'custom');
          } else {
            BackendManager.makeQuery('podcasts/playlist/add', JSON.stringify({
              user_id: UserManager.id,
              podcast_id: this.state.podcast.id,
              podcast_title: this.state.podcast.title,
              podcast_thumbnail: this.state.podcast.image,
              podcast_duration: this.state.podcast.duration,
              podcast_url: this.state.podcast.audio,
            }))
            .then(data => {
              console.log(data);
              if (data.success) {
                this.props.showToast('Saved!', 'custom');
              }
            });
          }
        }
      });
    }
  }

	renderView(classes) {
		if (this.state.show404) {
			return (
				<BrokenPageSection />
			);
		} else {
			return (
				<div>
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

export default PodcastPage;
