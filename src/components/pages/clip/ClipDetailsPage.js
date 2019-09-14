import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import InfiniteScroll from 'react-infinite-scroller';

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
  },
	root: {
    marginTop: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: '60%',
  },
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

  componentDidMount() {
    BackendManager.makeQuery('clips/any', JSON.stringify({
      uuid: this.props.match.params.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          clip: data.clip,
          title: data.clip.title,
        });

				BackendManager.makeQuery('genres/clip', JSON.stringify({
					clip_id: data.clip.id,
				}))
		    .then(data => {
		      console.log(data);
		      if (data.success) {
		        this.setState({
		          selectedGenres: data.genres,
		        });
		      }
		    });
      }
    });

		BackendManager.makeQuery('genres/all', JSON.stringify({}))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          allGenres: data.genres,
          displayedGenres: data.genres,
        });
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
			clip: null,
			isPlaying: true,
			seekStart: 0,
			duration: 0,
      title: "",
      active: 1,
			selectedGenres: [],
			allGenres: [],
			displayedGenres: [],
			searchedGenre: '',
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
		this.renderGenresView = this.renderGenresView.bind(this);
		this.renderView = this.renderView.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleSearchGenreChange = this.handleSearchGenreChange.bind(this);
		this.renderCreateNewGenre = this.renderCreateNewGenre.bind(this);
  }

	ref = player => {
    this.player = player
  }

  renderVideoPlayer() {
    if (this.state.clip) {
      return (
        <div style={{margin: 20}}>
					<img style={{height: 160, width: 160, objectFit: 'cover'}} src={this.state.clip.podcast_thumbnail}/>
          <ReactPlayer
						ref={this.ref}
						width={0}
						height={0}
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
					{this.renderGenresView(classes)}
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
      axios.post(`https://api.mypokadot.com/pp/upload`, formData, {
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

	handleSearchGenreChange(e) {
		this.setState({
			searchedGenre: e.target.value,
		});
		if (e.target.value == '') {
			this.setState({
				displayedGenres: this.state.allGenres,
			});
		} else {
			var displayedGenres = this.state.allGenres.filter(function (genre) {
			  return genre.name.toLowerCase().startsWith(e.target.value.toLowerCase());
			});
			this.setState({
				displayedGenres: displayedGenres,
			});
		}
	}

	renderGenresView(classes) {
		return (
			<div>
				<div className={classes.root}>
					<p style={{margin: 20, color: '#FFFFFF', width: '100%', textAlign: 'center'}}>{"Add Genres"}</p>
					<GridList cellHeight={50} className={classes.gridList} cols={6}>
						{this.state.selectedGenres.map(genre => (
							<GridListTile key={genre.id} style={{cursor: 'pointer'}}>
								<button className='button-rounded-no-mar' style={{background: '#42BCBB'}}>
									{genre.name}
								</button>
							</GridListTile>
						))}
					</GridList>
					<div style={{backgroundColor: 'white', width: '100%', margin: 20, height: 1}} />
					<Paper style={{width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, marginLeft: 50, marginRight: 50, marginBottom: 10}}>
	          <InputBase
	            className={classes.textFieldInputRoot}
	            fullWidth
	            placeholder="Search Podcasts"
	            onChange={this.handleSearchGenreChange}
	          />
	        </Paper>
					<GridList cellHeight={50} className={classes.gridList} cols={6}>
						{this.state.displayedGenres.map(genre => (
							<GridListTile key={genre.id} style={{cursor: 'pointer'}}>
								<button className='button-rounded-no-mar' style={{background: '#42BCBB'}}>
									{genre.name}
								</button>
							</GridListTile>
						))}
					</GridList>
					{this.renderCreateNewGenre()}
				</div>
			</div>
		);
	}

	renderCreateNewGenre() {
		if (this.state.searchedGenre != '') {
			return (
				<div>
					<p style={{margin: 20, color: '#FFFFFF', textSize: 12}}>{"Don't see the genre you want? Click Create New!"}</p>
					<button className='button-rounded-purple-no-mar'>
						{'Create New'}
					</button>
				</div>
			);
		}
	}

	renderView(classes) {
		return (
			<div>
				<div style={{float: 'left'}}>
        	{this.renderVideoPlayer()}
				</div>
				<div style={{marginLeft: 200}}>
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
