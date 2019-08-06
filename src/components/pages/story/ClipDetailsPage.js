import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import '../../sections/video-thumbnail.css';
import VideoThumbnail from 'react-video-thumbnail';

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

class ClipDetailsPage extends Component {

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
    BackendManager.makeQuery('clips/details', JSON.stringify({
      uuid: this.props.match.params.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          clip: data.clip,
          title: data.clip.title,
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.clip) {
      if (!this.state.snapshot && !this.state.hasSetSnapshot) {
        const { metadataLoaded, dataLoaded, suspended, seeked, snapshot } = this.state;

        // check if all 3 required events fired
        if (metadataLoaded && dataLoaded && suspended) {
          if (!this.refs.videoEl.currentTime || this.refs.videoEl.currentTime < 2) {
            this.refs.videoEl.currentTime = 0;
          }
        }

        if (seeked && !snapshot) {
          this.getSnapShot();
        }
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
			clip: null,
			isPlaying: true,
			seekStart: 0,
			duration: 0,
      metadataLoaded: false,
      dataLoaded: false,
      suspended: false,
      seeked: false,
      snapshot: null,
      snapshotUrl: null,
      hasSetSnapshot: false,
      title: "",
      active: 1,
    };

		this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
		this.renderTrimmerView = this.renderTrimmerView.bind(this);
		this.renderSlider = this.renderSlider.bind(this);
		this.handleDurationChange = this.handleDurationChange.bind(this);
		this.handleVideoProgress = this.handleVideoProgress.bind(this);
		this.handlePlayPause = this.handlePlayPause.bind(this);
		this.renderPlayPause = this.renderPlayPause.bind(this);
		this.renderProgressStr = this.renderProgressStr.bind(this);
		this.handleDoneClick = this.handleDoneClick.bind(this);
		this.renderView = this.renderView.bind(this);
    this.renderThumbnailView = this.renderThumbnailView.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
  }

	ref = player => {
    this.player = player
  }

  renderVideoPlayer() {
    if (this.state.clip) {
      return (
        <div style={{margin: 20}}>
          <ReactPlayer
						ref={this.ref}
						width={350}
						height={200}
						progressInterval={10}
						url={this.state.clip.url}
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
	}

	handleVideoProgress(state) {
		this.setState({
			seekStart: state.playedSeconds,
		});
  }


  renderThumbnailView() {
    if (this.state.clip) {
      if (this.state.snapshot) {
        return (
          <div style={{marginLeft: 10}}>
            <p style={{color: 'white', fontSize: 10}}>{'Thumbnail Image'}</p>
            <img style={{width: 100}} src={this.state.snapshot}/>
          </div>
        );
      } else {
        return (
          <div style={{marginLeft: 10}}>
            <p style={{color: 'white', fontSize: 10}}>{'Loading Thumbnail Image...'}</p>
            <div style={{width: 100, height: 75}}>
              <VideoThumbnail
                cors={false}
                videoUrl={this.state.clip.url}
                thumbnailHandler={(thumbnail) => this.setState({snapshot: thumbnail})}/>
            </div>
          </div>
        );
      }
    }
  }

	renderTrimmerView(classes) {
		if (this.state.clip) {
			return (
				<div style={{marginRight: 20, marginTop: 20, backgroundColor: '#30343E', borderRadius: 5}}>
					<h3 style={{margin: 20, color: '#FFFFFF', paddingTop: 20}}>{"Clip Details"}</h3>
					{this.renderPlayPause()}
					{this.renderProgressStr()}
					<div style={{marginLeft: 20, marginRight: 20}}>
						{this.renderSlider()}
					</div>
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
          {this.renderThumbnailView()}
          <div style={{paddingBottom: 10}}/>
					<button className="button-red" style={{margin: 20, float: 'right'}} onClick={() => this.handleDoneClick()}>{"Publish"}</button>
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
		if (state.length == 1) {
			this.setState({
				seekStart: state[0],
				isPlaying: true,
			});
		}
		if (this.state.seekStart < 1) {
			var percentage = this.state.seekStart / this.state.duration;
			this.player.seekTo(percentage);
		} else {
			this.player.seekTo(this.state.seekStart);
		}
	}

	renderSlider() {
		if (this.state.clip) {
			var values = [];
			return (
				<div>
					<Slider
						rootStyle={sliderStyle}
						domain={[0, this.state.duration]}
						step={0.01}
						mode={1}
						onSlideStart={this.handleSlideStart}
						onSlideEnd={this.handleSlideEnd}
						values={[this.state.seekStart]}
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

	handleDoneClick() {
    if (this.state.clip && this.state.snapshot) {
      // var snapshot = this.state.snapshot;
      // snapshot.lastModifiedDate = new Date();
      // const timestamp = Date.now().toString();
      // snapshot.name = this.state.clip.id + "_" + timestamp + ".png";
      var snapshot = this.state.snapshot;
      var jpegFile64 = snapshot.replace(/^data:image\/(png|jpeg);base64,/, "");
      console.log(jpegFile64);
      var jpegBlob = UtilsManager.base64ToBlob(jpegFile64, 'image/jpeg');
      jpegBlob.name = "clip.jpg";
      console.log(jpegBlob);
      const formData = new FormData();
      formData.append('file', jpegBlob, "clip.jpg");
      axios.post(`http://localhost:8080/pp/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
        var url = "https://s3-us-west-2.amazonaws.com/riptide-images/";
        var imageUrl = url + data.data.title.split(' ').join('+');
        BackendManager.makeQuery('clips/update/details', JSON.stringify({
          thumbnail_url: imageUrl,
          title: this.state.title,
          clip_id: this.state.clip.id,
        }))
        .then(data => {
          this.props.history.push('/clips/' + this.state.clip.uuid);
        });
      }).catch(error => {
        // handle your error
      });
    }

	}

	renderView(classes) {
		return (
			<div>
				<div style={{float: 'left'}}>
        	{this.renderVideoPlayer()}
				</div>
				<div style={{marginLeft: 390}}>
					{this.renderTrimmerView(classes)}
				</div>
			</div>
		);
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

export default withStyles(styles)(ClipDetailsPage);
