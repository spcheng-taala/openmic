import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';

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
		background: 'rgba(255, 255, 255, 1)',
    transform: 'translate(-50%, -50%)'
  },
};

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

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

class CreateClipPage extends Component {

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
    var url = localStorage.getItem('url');
		if (url) {
			this.setState({
				url: url
			});
		}
    var videos = [
      {
        id: 1,
        url: "https://s3-us-west-2.amazonaws.com/taala-media.io/10_1494102676.mpg4",
        duration: 9.43
      },
      {
        id: 2,
        url: "https://s3-us-west-2.amazonaws.com/taala-media.io/10_1494102676.mpg4",
        duration: 9.43
      }
    ];
    if (videos) {
      this.setState({
        videos: videos
      });
      var totalDuration = 0;
      for (var i = 0; i < videos.length; i++) {
        totalDuration += videos[i].duration;
      }
      this.setState({
        currentClip: videos[0],
        totalDuration: totalDuration,
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      url: "https://s3-us-west-2.amazonaws.com/taala-media.io/10_1494102676.mpg4",
			isPlaying: true,
			seek: 0,
      totalSeek: 0,
			duration: 0,
      totalDuration: 0,
      currentClip: null,
			videos: [],
    };

		this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
		this.renderTrimmerView = this.renderTrimmerView.bind(this);
		this.renderSlider = this.renderSlider.bind(this);
		this.handleDurationChange = this.handleDurationChange.bind(this);
		this.handleVideoProgress = this.handleVideoProgress.bind(this);
		this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
		this.handleStartValueChange = this.handleStartValueChange.bind(this);
		this.handlePlayPause = this.handlePlayPause.bind(this);
		this.renderPlayPause = this.renderPlayPause.bind(this);
		this.renderProgressStr = this.renderProgressStr.bind(this);
		this.handleTrimClick = this.handleTrimClick.bind(this);
		this.renderView = this.renderView.bind(this);
  }

	ref = player => {
    this.player = player
  }

  renderVideoPlayer() {
    if (this.state.url != "" && this.state.currentClip) {
      return (
        <div style={{margin: 20}}>
          <ReactPlayer
            key={this.state.currentClip.id}
						ref={this.ref}
						width={350}
						height={200}
						progressInterval={10}
						url={this.state.url}
						onDuration={this.handleDurationChange}
						onProgress={this.handleVideoProgress}
						playing={this.state.isPlaying}/>
        </div>
      );
    }
  }

	handleDurationChange(duration) {
		this.setState({
			duration: duration,
		});
	}

	handleVideoProgress(state) {
    if (this.state.currentClip) {
      if (state.playedSeconds >= this.state.duration)	{
        for (var i = 0; i < this.state.videos.length; i++) {
          if (this.state.videos[i].id == this.state.currentClip.id) {
            if (i < this.state.videos.length - 1) {
              this.setState({
                url: this.state.videos[i+1].url,
                currentClip: this.state.videos[i+1],
              });
            }
          }
        }
      }
      var secondsBefore = 0;
      for (var i = 0; i < this.state.videos.length; i++) {
        if (this.state.videos[i].id != this.state.currentClip.id) {
          secondsBefore += this.state.videos[i].duration;
        } else {
          secondsBefore += state.playedSeconds;
          break;
        }
      }

  		this.setState({
  			totalSeek: secondsBefore,
  		});
    }
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

	renderTrimmerView() {
		if (this.state.url != "") {
			return (
				<div style={{marginRight: 20, marginTop: 20, backgroundColor: '#30343E', borderRadius: 5}}>
					<h3 style={{margin: 20, color: '#FFFFFF', paddingTop: 20}}>{"Trim Video"}</h3>
					{this.renderPlayPause()}
					{this.renderProgressStr()}
					<div style={{marginLeft: 20, marginRight: 20}}>
						{this.renderSlider()}
					</div>
          {
            !this.state.videos.isEmpty ?
            <button className="button-purple" style={{margin: 20, float: 'right'}} onClick={() => this.handleTrimClick()}>{"Click to start clipping"}</button> :
            <div>
              <button className="button-red" style={{display: 'inline-block', margin: 20, float: 'right'}} onClick={() => this.handleTrimClick()}>{"Done"}</button>
              <button className="button-purple" style={{display: 'inline-block', marginTop: 20, float: 'right'}} onClick={() => this.handleTrimClick()}>{"Add another clip"}</button>
            </div>
          }
				</div>
			);
		}
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
					<img style={playPauseButtonStyle} src='../../../../../images/pause_green.png'/>
				</div>
			);
		} else {
			return (
				<div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => this.handlePlayPause()}>
					<img style={playPauseButtonStyle} src='../../../../../images/play_green.png'/>
				</div>
			);
		}
	}

	renderProgressStr() {
		return (
			<div style={{marginLeft: 20}}>
				<p style={{color: 'white', fontSize: 15}}>{UtilsManager.createMinString(this.state.totalSeek) + " / " + UtilsManager.createMinString(this.state.totalDuration)}</p>
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
				totalSeek: state[0],
				isPlaying: true,
			});
		}

    console.log(state[0]);

    var duration = 0;
    var beforeDuration = 0;
    var currentTime = 0;
    for (var i = 0; i < this.state.videos.length; i++) {
      duration += this.state.videos[i].duration;
      if (state[0] <= duration && state[0] >= beforeDuration) {
        currentTime = state[0] - beforeDuration;
        this.setState({
          url: this.state.videos[i].url,
          currentClip: this.state.videos[i],
        });
        if (currentTime < 1) {
    			var percentage = currentTime / this.state.videos[i].duration;
          console.log(percentage);
    			this.player.seekTo(percentage);
    		} else {
    			this.player.seekTo(currentTime);
          console.log(currentTime);
    		}
        break;
      } else {
        beforeDuration += this.state.videos[i].duration;
      }
    }
	}

	renderSlider() {
		if (this.state.url != "") {
			return (
				<div>
					<Slider
						rootStyle={sliderStyle}
						domain={[0, this.state.totalDuration]}
						step={0.01}
						mode={1}
						onSlideStart={this.handleSlideStart}
						onSlideEnd={this.handleSlideEnd}
						values={[this.state.totalSeek]}
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
						<Tracks left={true} right={false}>
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
		var start = this.state.start;
		var end = this.state.end;
		var duration = end - start;
		BackendManager.makeQuery('trim/video', JSON.stringify({
			url: this.state.url,
			start_time: start,
			duration: duration,
			user_id: UserManager.id,
		}))
		.then(data => {
			console.log(data);
			if (data.success) {
				var clipUrl = BackendManager.fileUrl + data.title;
				this.setState({
					start: 0,
					end: this.state.duration,
					seekStart: 0,
				});
				var video = {
					url: clipUrl,
				};
				var videos = this.state.videos;
				videos.push(video);
				this.setState({
					videos: videos
				});
			}
		});
	}

	renderView() {
		return (
			<div>
				<div style={{float: 'left'}}>
        	{this.renderVideoPlayer()}
				</div>
				<div style={{marginLeft: 390}}>
					{this.renderTrimmerView()}
				</div>
			</div>
		);
	}

  render() {
    const { classes } = this.props;
		return (
      <div>
				{this.renderView()}
      </div>
    )
  }
}

export default CreateClipPage;
