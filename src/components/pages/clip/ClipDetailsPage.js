import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import { Slider, Handles, Tracks } from 'react-compound-slider'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Helmet } from 'react-helmet';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import CreateGenreModal from './components/CreateGenreModal.js';

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
    transform: 'translate(-50%, -50%)'
  },
};

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
      if (data.success) {
				console.log(data);
        this.setState({
          clip: data.clip,
          title: data.clip.title,
        });

				BackendManager.makeQuery('genres/clip', JSON.stringify({
					clip_id: data.clip.id,
				}))
		    .then(data => {
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
			start: 0,
			end: 1,
			duration: 0,
      title: "",
      active: 1,
			selectedGenres: [],
			allGenres: [],
			displayedGenres: [],
			searchedGenre: '',
			createGenreModalIsOpen: false,
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
		this.addGenre = this.addGenre.bind(this);
		this.removeGenre = this.removeGenre.bind(this);
		this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
		this.handleStartValueChange = this.handleStartValueChange.bind(this);
		this.handleEndValueChange = this.handleEndValueChange.bind(this);
		this.handleSearchGenreChange = this.handleSearchGenreChange.bind(this);
		this.renderCreateNewGenre = this.renderCreateNewGenre.bind(this);
		this.createGenre = this.createGenre.bind(this);
		this.openCreateGenreModal = this.openCreateGenreModal.bind(this);
		this.closeCreateGenreModal = this.closeCreateGenreModal.bind(this);
  }

	ref = player => {
    this.player = player
  }

  renderVideoPlayer() {
    if (this.state.clip) {

      return (
        <div style={{margin: 20}}>
					<img alt={"thumbnail"} style={{height: 160, width: 160, objectFit: 'cover'}} src={this.state.clip.podcast_thumbnail}/>
          <ReactPlayer
						ref={this.ref}
						width={0}
						height={0}
						progressInterval={10}
						url={this.state.clip.original_url}
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

		if (this.state.end == 1) {
			var end = duration;
			var start = 0;
			if (duration > 60) {
				start = 60;
				end -= 60;
			}
			this.player.seekTo(start);
			this.setState({
				seekStart: start,								
				start: start,
				end: end,
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

	renderTrimmerView(classes) {
		if (this.state.clip) {
			return (
				<div style={{marginRight: 20, marginTop: 20, backgroundColor: '#30343E', borderRadius: 5}}>
					<h3 style={{margin: 20, color: '#FFFFFF', paddingTop: 20}}>{"Clip Details"}</h3>
					<p style={{marginLeft: 20, marginRight: 20, color: '#FFFFFF', fontSize: 14}}>{"You can fine-tune your clip here! You can also edit the title as well as tag Genres to this clip!"}</p>
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
							</div>
						</div>
					</div>
					{this.renderPlayPause()}
					{this.renderProgressStr()}
					<div style={{marginLeft: 20, marginRight: 20}}>
						{this.renderSlider(false)}
						{this.renderSlider(true)}
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

	renderSlider(isDouble) {
		if (this.state.clip) {
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

	handleDoneClick() {
    if (this.state.clip) {
			if (this.state.selectedGenres.length > 0) {
				var url = this.state.clip.url;
				var updateUrl = false;
				var duration = this.state.duration;
				if (this.state.start > 0 || this.state.end < this.state.duration) {
					const timestamp = Date.now().toString();
					var fileName = UserManager.id + "_" + timestamp + ".mp3";
					url = BackendManager.fileUrl + fileName;
					updateUrl = true;
					duration = this.state.end - this.state.start;
				}
				BackendManager.makeQuery('clips/update', JSON.stringify({
					title: this.state.title,
					clip_id: this.state.clip.id,
					url: url,
					duration: duration,
				}))
				.then(data => {
					if (data.success) {
						var genres = [];
						var selectedGenres = this.state.selectedGenres;
						for (var i = 0; i < selectedGenres.length; i++) {
							genres.push({
								genre_id: selectedGenres[i].id,
							});
						}
						BackendManager.makeQuery('genres/clip/create', JSON.stringify({
							genres: genres,
							clip_id: this.state.clip.id,
						}))
						.then(data => {
							BackendManager.makeQuery('clips/reaction/create', JSON.stringify({
								user_id: UserManager.id,
								clip_id: this.state.clip.id,
								reaction: 1,
							}))
							.then(data => {
								if (updateUrl) {
									BackendManager.makeQuery('trim/audio', JSON.stringify({
										url: this.state.clip.original_url,
										start_time: this.state.start,
										duration: this.state.end - this.state.start,
										file_name: fileName,
										clip_id: this.state.clip.id,
										email: UserManager.email,
									}))
									.then(data => {
										localStorage.setItem('clip_uuid', this.state.clip.uuid);
										localStorage.setItem('clip_id', this.state.clip.id);
										localStorage.setItem('is_edit', 1);
										localStorage.setItem('clip_url', url);
										this.props.history.push('/publishing');
									});
								} else {
									this.props.history.push('/clips/' + this.state.clip.uuid);
								}
							});
						});
					}
				});
			} else {
				this.props.showToast("Please add at least one genre", 'custom');
			}
    }
	}

	handleSearchGenreChange(e) {
		this.setState({
			searchedGenre: e.target.value,
		});
		if (e.target.value === '') {
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

	addGenre(genre) {
		var selectedGenres = this.state.selectedGenres;
		var hasGenre = false;
		for (var i = 0; i < selectedGenres.length; i++) {
			if (selectedGenres[i].id === genre.id) {
				hasGenre = true;
			}
		}

		if (hasGenre) {
			this.props.showToast('Already added!', 'custom');
		} else {
			selectedGenres.push(genre);
			selectedGenres.sort((a, b) => (a.name > b.name) ? 1 : -1);
			this.setState({
				selectedGenres: selectedGenres
			});
		}
	}

	removeGenre(genre) {
		var selectedGenres = this.state.selectedGenres;
		for (var i = 0; i < selectedGenres.length; i++) {
			if (selectedGenres[i].id === genre.id) {
				selectedGenres.splice(i, 1);
				break;
			}
		}
		this.setState({
			selectedGenres: selectedGenres
		});
	}

	renderGenresView(classes) {
		return (
			<div>
				<div className={classes.root}>
					<p style={{margin: 20, color: '#FFFFFF', width: '100%', textAlign: 'center'}}>{"Add Genres"}</p>
					<GridList cellHeight={50} className={classes.gridList} cols={6}>
						{this.state.selectedGenres.map(genre => (
							<GridListTile key={genre.id} style={{cursor: 'pointer'}} onClick={() => this.removeGenre(genre)}>
								<button className='button-rounded-no-mar' style={{background: '#42BCBB'}}>
									{genre.name}
								</button>
							</GridListTile>
						))}
					</GridList>
					<div style={{backgroundColor: 'white', width: '100%', margin: 20, height: 1}} />
					<Paper style={{width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, marginLeft: 50, marginRight: 50, marginBottom: 20}}>
	          <InputBase
	            className={classes.textFieldInputRoot}
	            fullWidth
							value={this.state.searchedGenre}
	            placeholder="Search Genres"
	            onChange={this.handleSearchGenreChange}
	          />
	        </Paper>
					<GridList cellHeight={50} className={classes.gridList} cols={6}>
						{this.state.displayedGenres.map(genre => (
							<GridListTile key={genre.id} style={{cursor: 'pointer'}} onClick={() => this.addGenre(genre)}>
								<button className='button-rounded-no-mar' style={{background: '#42BCBB'}}>
									{genre.name}
								</button>
							</GridListTile>
						))}
					</GridList>
				</div>
				{this.renderCreateNewGenre()}
			</div>
		);
	}

	renderCreateNewGenre() {
		if (this.state.searchedGenre !== '') {
			return (
				<div>
					<p style={{margin: 20, color: '#FFFFFF', textSize: 12}}>{"Don't see the genre you want? Click Create New!"}</p>
					<button className='button-rounded-no-mar' style={{marginLeft: 20, backgroundColor: '#6175E0'}} onClick={() => this.openCreateGenreModal()}>
						{'Create New'}
					</button>
				</div>
			);
		}
	}

	createGenre(genre) {
		var allGenres = this.state.allGenres;
		var selectedGenres = this.state.selectedGenres;
		allGenres.push(genre);
		selectedGenres.push(genre);
		this.setState({
			selectedGenres: selectedGenres,
			allGenres: allGenres,
			displayedGenres: allGenres,
			searchedGenre: '',
			createGenreModalIsOpen: false,
		});
	}

	renderView(classes) {
		return (
			<div>
				<Helmet>
					<title>{"Clip details - Riptide"}</title>
				</Helmet>
				<div style={{float: 'left'}}>
        	{this.renderVideoPlayer()}
				</div>
				<div style={{marginLeft: 200}}>
					{this.renderTrimmerView(classes)}
				</div>
			</div>
		);
	}

	openCreateGenreModal() {
		this.setState({
			createGenreModalIsOpen: true
		});
	}

	closeCreateGenreModal() {
		this.setState({
			createGenreModalIsOpen: false
		});
	}

  render() {
    const { classes } = this.props;
		return (
      <div>
				<Modal
					isOpen={this.state.createGenreModalIsOpen}
					onRequestClose={this.closeCreateGenreModal}
					style={customStyles}
					contentLabel="Create Genre"
				>
					<CreateGenreModal showToast={this.props.showToast} createGenre={this.createGenre} />
				</Modal>
				{this.renderView(classes)}
      </div>
    )
  }
}

export default withStyles(styles)(ClipDetailsPage);
