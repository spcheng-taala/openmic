import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Slider, Handles, Tracks } from 'react-compound-slider'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Helmet } from 'react-helmet';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';

const inputStyle = {
	display: 'inline-block',
	borderRadius: 4,
	border: '1px solid white',
	maxWidth: 150,
	fontFamily: 'Lato',
	outline: 'none',
	height: 40,
	fontSize: 16,
	paddingLeft: 10,
	paddingRight: 10,
	marginRight: 10,
	color: 'transparent',
  textShadow: '0 0 0 #6175E0',
}

const playPauseButtonStyle = {
	width: 70,
}

const sliderStyle = {  // Give the slider some width
  position: 'relative',
  width: '100%',
  height: 80,
}

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: '#8B9CB6',
}

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: 'Lato',
		backgroundColor: 'white',
		borderRadius: 5
  },
  textFieldLabelRoot: {
    fontFamily: 'Lato',
  }
});

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

class TrimContentPage extends Component {

  static defaultProps = {
    isDraggable: true,
    isResizable: true,
    compactType: 'horizontal',
    // verticalCompact: false,
    rowHeight: 30,
    cols: 100,
    onLayoutChange: function() {},
  };

  componentDidMount() {
		var podcastId = localStorage.getItem('podcast_id');
		var podcastTitle = localStorage.getItem('podcast_title');
		var thumbnail = localStorage.getItem('podcast_thumbnail');
		var podcastDuration = localStorage.getItem('podcast_duration');
		var podcastDescription = localStorage.getItem('podcast_description');
    var url = localStorage.getItem('url');
		if (podcastId && url && thumbnail && podcastTitle && podcastDuration && podcastDescription) {
			this.setState({
				podcastId: podcastId,
				podcastTitle: podcastTitle,
				thumbnail: thumbnail,
				url: url,
				podcastDuration: podcastDuration,
				podcastDescription: podcastDescription,
			});
			localStorage.removeItem('podcast_id');
			localStorage.removeItem('podcast_title');
			localStorage.removeItem('podcast_thumbnail');
			localStorage.removeItem('podcast_duration');
			localStorage.removeItem('podcast_description');
      localStorage.removeItem('url');
		} else {
			this.props.history.push('/');
		}

		window.addEventListener("resize", this.resize, false);
    this.resize();
  }

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize, false);
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
			isMobile: false,
			podcastId: "",
			podcastTitle: "",
			thumbnail: "",
      url: "",
			podcastDescription: "",
			isPlaying: true,
			seekStart: 0,
			duration: 0,
			start: 0,
			end: 1,
			title: "",
			showTrimError: false,
    };

		this.resize = this.resize.bind(this);
		this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
		this.renderTrimmerView = this.renderTrimmerView.bind(this);
		this.renderSlider = this.renderSlider.bind(this);
		this.handleDurationChange = this.handleDurationChange.bind(this);
		this.handleVideoProgress = this.handleVideoProgress.bind(this);
		this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
		this.handleStartValueChange = this.handleStartValueChange.bind(this);
		this.handleEndValueChange = this.handleEndValueChange.bind(this);
		this.handlePlayPause = this.handlePlayPause.bind(this);
		this.renderPlayPause = this.renderPlayPause.bind(this);
		this.renderProgressStr = this.renderProgressStr.bind(this);
		this.handleTrimClick = this.handleTrimClick.bind(this);
		this.renderView = this.renderView.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
  }

	ref = player => {
    this.player = player
  }

  renderVideoPlayer() {
    if (this.state.url !== "") {
      return (
        <div style={{margin: 20}}>
					<img alt={"thumbnail"} style={{height: 160, width: 160, objectFit: 'cover'}} src={this.state.thumbnail}/>
          <ReactPlayer
						ref={this.ref}
						width={0}
						height={0}
						progressInterval={10}
						url={this.state.url}
						onDuration={this.handleDurationChange}
						onProgress={this.handleVideoProgress}
						playing={this.state.isPlaying}
						loop />
        </div>
      );
    }
  }

	handleDurationChange(duration) {
		this.setState({
			duration: duration,
		});
		if (this.state.end === 1) {
			this.setState({
				end: duration
			});
		}
	}

	handleVideoProgress(state) {
		if (state.playedSeconds >= this.state.end) {
			if (this.state.start < 1) {
				var percentage = this.state.start / this.state.duration;
				this.player.seekTo(percentage);
			} else {
				this.player.seekTo(this.state.start);
			}
		}
		this.setState({
			seekStart: state.playedSeconds,
		});
  }

	handleStartValueChange(isIncrease) {
		var start = this.state.start;
		if (isIncrease) {
			start += 0.5;
			if (start < this.state.end) {
				this.setState({
					seekStart: start,
					start: start,
				});
			}
		} else {
			start -= 0.5;
			if (start >= 0) {
				this.setState({
					seekStart: start,
					start: start
				});
			}
		}

		if (start < 1) {
			var percentage = start / this.state.duration;
			this.player.seekTo(percentage);
		} else {
			this.player.seekTo(start);
		}
	}

	handleEndValueChange(isIncrease) {
		var end = this.state.end;
		if (isIncrease) {
			end += 0.5;
			if (end <= this.state.duration) {
				this.setState({
					end: end
				});
			}
		} else {
			end -= 0.5;
			if (end > this.state.start) {
				this.setState({
					end: end
				});
			}
		}
	}

	renderTrimmerView(classes) {
		if (this.state.url !== "") {
			return (
				<div style={{marginRight: 20, marginTop: 20, backgroundColor: '#30343E', borderRadius: 5}}>
					<h3 style={{margin: 20, color: '#FFFFFF', paddingTop: 20}}>{"Clip Podcast"}</h3>
					<p style={{marginLeft: 20, marginRight: 20, color: '#FFFFFF', fontSize: 14}}>{"You can just ballpark this! We add 1 min to the beginning and end of your trim to give you some buffer. You will be able to fine-tune your clip after you click Done!"}</p>
					<div style={{margin: 20, paddingBottom: 20}}>
						<div style={{display: 'inline-block'}}>
							<p style={{color: 'white'}}>{"Start"}</p>
							<input style={inputStyle} readonly value={UtilsManager.createTimeString(this.state.start)}/>
							<div>
								<button className="button-purple-small" style={{display: 'inline-block', marginTop: 5, marginRight: 5}} onClick={() => this.handleStartValueChange(false)}>{"-0.5s"}</button>
								<button className="button-purple-small" style={{display: 'inline-block'}} onClick={() => this.handleStartValueChange(true)}>{"+0.5s"}</button>
							</div>
						</div>
						<div style={{display: 'inline-block'}}>
							<p style={{color: 'white'}}>{"End"}</p>
							<input style={inputStyle} readonly value={UtilsManager.createTimeString(this.state.end)}/>
							<div>
								<button className="button-purple-small" style={{display: 'inline-block', marginTop: 5, marginRight: 5}} onClick={() => this.handleEndValueChange(false)}>{"-0.5s"}</button>
								<button className="button-purple-small" style={{display: 'inline-block'}} onClick={() => this.handleEndValueChange(true)}>{"+0.5s"}</button>
								<button className="button-purple-small" style={{display: 'inline-block', marginLeft: 5}} onClick={() => this.setState({end: this.state.seekStart})}>{"Set end time to current time"}</button>
							</div>
						</div>
					</div>
					{this.renderPlayPause()}
					{this.renderProgressStr()}
					<div style={{marginLeft: 20, marginRight: 20}}>
						{this.renderSlider(false)}
						{this.renderSlider(true)}
					</div>
					{this.state.showTrimError ? <p style={{marginLeft: 20, marginRight: 20, color: '#FFFFFF', fontSize: 14}}>{"Move the left and right dots to clip the podcast"}</p> : <div/>}
					<div style={{marginLeft: 10, marginRight: 10, paddingBottom: 20}}>
						<TextField
							label="Title"
							multiline
							fullWidth
							rows="1"
							value={this.state.title}
							InputProps={{ classes: { root: classes.textFieldInputRoot } }}
							InputLabelProps={{
								FormLabelClasses: {
									root: classes.textFieldLabelRoot
								}
							}}
							onChange={this.handleTitleChange}
							margin="normal"
							variant="outlined"
						/>
					</div>
					<button className="button-red" style={{margin: 20, float: 'right'}} onClick={() => this.handleTrimClick()}>{"Done"}</button>
				</div>
			);
		}
	}

	handleTitleChange(e) {
		this.setState({
      title: e.target.value
    });
	}

	handlePlayPause() {
		this.setState({
			isPlaying: !this.state.isPlaying
		});
	}

	renderPlayPause() {
		if (this.state.isPlaying) {
			return (
				<div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => this.handlePlayPause()}>
					<img alt={"pause"} style={playPauseButtonStyle} src='../../../../../images/pause_green.png'/>
				</div>
			);
		} else {
			return (
				<div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => this.handlePlayPause()}>
					<img alt={"play"} style={playPauseButtonStyle} src='../../../../../images/play_green.png'/>
				</div>
			);
		}
	}

	renderProgressStr() {
		return (
			<div style={{marginLeft: 20}}>
				<p style={{color: 'white', fontSize: 15}}>{UtilsManager.createTimeString(this.state.seekStart) + " / " + UtilsManager.createTimeString(this.state.duration)}</p>
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
				seekStart: state[0],
				isPlaying: true,
			});
		}	else if (state.length === 2) {
			this.setState({
				seekStart: state[0],
				start: state[0],
				end: state[1],
				isPlaying: true,
			});
		}
		if (this.state.seekStart < 1) {
			var percentage = state[0] / this.state.duration;
			this.player.seekTo(percentage);
		} else {
			this.player.seekTo(state[0]);
		}
	}

	renderSlider(isDouble) {
		if (this.state.url !== "") {
			var values = [];
			if (isDouble) {
				values.push(this.state.start);
				values.push(this.state.end);
			} else {
				values.push(this.state.seekStart);
			}
			return (
				<div>
					<Slider
						rootStyle={sliderStyle}
						domain={[0, this.state.duration]}
						step={0.01}
						mode={1}
						onSlideStart={this.handleSlideStart}
						onSlideEnd={this.handleSlideEnd}
						values={values}
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
						<Tracks left={!isDouble} right={false}>
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

	handleTrimClick() {
		if (this.state.start == 0 && this.state.end == this.state.duration) {
			this.setState({
				showTrimError: true,
			});
			this.props.showToast("Oops! Make sure you trim the podcast before continuing!", 'custom');
		} else {
			if (this.state.title != "") {
				var start = this.state.start;
				var end = this.state.end;
				if (start - 60 > 0) {
					start -= 60;
				} else {
					start = 0;
				}

				if (end + 60 > this.state.duration) {
					end = this.state.duration;
				} else {
					end += 60;
				}

				var duration = end - start;

				const timestamp = Date.now().toString();
				var fileName = UserManager.id + "_" + timestamp + ".mp3";
				var url = BackendManager.fileUrl + fileName;

				BackendManager.makeQuery('clips/create', JSON.stringify({
					url: url,
					original_url: url,
					title: this.state.title,
					podcast_id: this.state.podcastId,
					podcast_title: this.state.podcastTitle,
					podcast_thumbnail: this.state.thumbnail,
					podcast_url: this.state.url,
					podcast_duration: this.state.podcastDuration,
					podcast_description: this.state.podcastDescription,
					duration: duration,
					user_id: UserManager.id,
				}))
				.then(data => {
					var uuid = data.uuid;
					var clipId = data.id;
					if (data.success) {
						console.log(this.state.url);
						BackendManager.makeQuery('trim/audio', JSON.stringify({
							url: this.state.url,
							start_time: start,
							duration: duration,
							file_name: fileName,
							clip_id: clipId,
							email: UserManager.email,
						}))
						.then(data => {
							localStorage.setItem('clip_uuid', uuid);
							localStorage.setItem('clip_id', clipId);
							localStorage.setItem('is_edit', 0);
							localStorage.setItem('clip_url', url);
							this.props.history.push('/publishing');
						});
					}
				});
			}	else {
				this.props.showToast("Make sure you enter a title!", 'custom');
			}
		}
	}

	renderView(classes) {
		if (this.state.isMobile) {
			return (
				<div>
					<Helmet>
						<title>{"Studio - Riptide"}</title>
					</Helmet>
					{this.renderVideoPlayer()}
					<div style={{marginLeft: 20}}>
						{this.renderTrimmerView(classes)}
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<Helmet>
						<title>{"Studio - Riptide"}</title>
					</Helmet>
					<div style={{float: 'left'}}>
	        	{this.renderVideoPlayer()}
					</div>
					<div style={{marginLeft: 250}}>
						{this.renderTrimmerView(classes)}
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

export default withStyles(styles)(TrimContentPage);
