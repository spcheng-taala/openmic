import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import _ from "lodash";
import ContentModal from './components/ContentModal.js';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';

const GIF_AUTH_URL = "https://api.gfycat.com/v1/oauth/token";
const GIF_CLIENT_ID = "2_Wmm6n7";
const GIF_CLIENT_SECRET = "cv_z2WwrA7ji1wRTWWTN8dJ9hKHIgasdrEYMaeKw-7syTzSBBGn3Dumy09U6o4hl";

const ReactGridLayout = WidthProvider(RGL);

var uniqueCounter = 0;

const customStylesLight = {
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

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: 'Lato',
    color: 'white',
  },
  textFieldLabelRoot: {
    fontFamily: 'Lato',
    color: 'white',
  }
});

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
  paddingBottom: 20,
}

const validGif = {
  margin: 0,
  borderRadius: 5,
  paddingLeft: 2,
  color: 'white',
  backgroundColor: '#3ABBBC',
}

const removeStyle = {
  position: "absolute",
  right: "2px",
  top: 0,
  cursor: "pointer"
};

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

class EditorPage extends Component {

  static defaultProps = {
    isDraggable: true,
    isResizable: true,
    compactType: 'horizontal',
    verticalCompact: false,
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

    BackendManager.makeOutsideQuery(GIF_AUTH_URL, JSON.stringify({
			client_id: GIF_CLIENT_ID,
			client_secret: GIF_CLIENT_SECRET,
			grant_type: "client_credentials",
		}), "")
		.then(data => {
			console.log(data);
			if (data.access_token) {
				this.setState({
          gifToken: data.access_token,
        });
			}
		});
  }

  constructor(props) {
    super(props);
    this.state = {
      url: "https://riptide-clips.s3-us-west-2.amazonaws.com/RobertKellyClip.mp4",
			isPlaying: true,
      gifToken: "",
			content: [],
      activeContent: null,
			seekStart: 0,
			duration: 0,
      showContent: false,
      searchQuery: "",
      searchedContent: [],
      selectedContent: null,
      contentModalIsOpen: false,
    };

		this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
		this.renderContentView = this.renderContentView.bind(this);
		this.setNewContent = this.setNewContent.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onDragStop = this.onDragStop.bind(this);
    this.renderContentItem = this.renderContentItem.bind(this);
		this.renderSlider = this.renderSlider.bind(this);
		this.handleDurationChange = this.handleDurationChange.bind(this);
		this.handleVideoProgress = this.handleVideoProgress.bind(this);
		this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
		this.handlePlayPause = this.handlePlayPause.bind(this);
		this.renderPlayPause = this.renderPlayPause.bind(this);
		this.renderProgressStr = this.renderProgressStr.bind(this);
		this.handleTrimClick = this.handleTrimClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleGridClick = this.handleGridClick.bind(this);
    this.resizeVideo = this.resizeVideo.bind(this);
    this.closeContentModal = this.closeContentModal.bind(this);
		this.renderView = this.renderView.bind(this);
  }

	ref = player => {
    this.player = player
  }

  renderVideoPlayer() {
    if (this.state.url != "") {
      return (
        <div style={{margin: 20, width: 350, height: 200, position: 'relative'}}>
          <div style={{position: 'absolute', top: 0, left: 0}}>
            <ReactPlayer
              ref={this.ref}
              width={350}
              height={200}
              progressInterval={10}
              url={this.state.url}
              onDuration={this.handleDurationChange}
              onProgress={this.handleVideoProgress}
              playing={this.state.isPlaying}
              loop />
          </div>
          {this.state.showContent ?
            <div style={{position: 'absolute', top: 0, left: 0}}>
							<ReactPlayer
								width={350}
								height={200}
								volue={0}
								url={this.state.activeContent.url}
								playing={true}
								loop
								muted />              
            </div> : <div />
          }
        </div>
      );
    }
  }

	setNewContent(layoutItem) {
		var media = null;
		var index = 0;
    for (var i = 0; i < this.state.content.length; i++) {
      if (this.state.content[i].i == layoutItem.i) {
				index = i;
        media = this.state.content[i];
      }
    }

    if (media) {
      var newMedia = {
        i: layoutItem.i,
        grid: {
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        },
        url: media.url,
        duration: media.duration,
      }

      var content = this.state.content;
      content[index] = newMedia;

      this.setState({
        content: content,
      });
    }
	}

	onResize(layout, oldLayoutItem, layoutItem, placeholder) {
    // `oldLayoutItem` contains the state of the item before the resize.
    // You can modify `layoutItem` to enforce constraints.
    layoutItem.h = 2;
    placeholder.h = 2;

    var size = 0;
    for (var i = 0; i < layout.length; i++) {
      size += layout[i].w;
    }

    if (layoutItem.w + layoutItem.x > 100) {
      layoutItem.w = 100 - layoutItem.x;
    }

		this.setNewContent(layoutItem);
  }

	onDragStop(layout, oldLayoutItem, layoutItem, placeholder) {
    var hasOverlap = false;
    for (var i = 0; i < layout.length; i++) {
      if (layout[i].i != layoutItem.i) {
        if (layoutItem.x >= layout[i].x && layoutItem.x < (layout[i].x + layout[i].w)) {
          hasOverlap = true;
        }
      }
    }

    if (hasOverlap) {
      layoutItem.x = oldLayoutItem.x;
    }

    if (layoutItem.y > 0) {
      layoutItem.y = oldLayoutItem.y;
    }

		this.setNewContent(layoutItem);
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
    var percentage = state.playedSeconds / this.state.duration;
    var showContent = false;
    var content = this.state.content;
    var index = 0;
    for (var i = 0; i < content.length; i++) {
      if (percentage >= parseFloat(content[i].grid.x / 100) && percentage <= parseFloat((content[i].grid.x + content[i].grid.w) / 100)) {
        index = i;
        showContent = true;
      }
    }

    if (showContent != this.state.showContent) {
      this.setState({
        activeContent: this.state.content[index],
        showContent: showContent
      });
    }
  }

  handleTrimClick() {
    var videoClips = [];
    var allClips = [];
    var startTime = 0;
    var endTime = this.state.duration;
    for (var i = 0; i < this.state.content.length; i++) {
      endTime = parseFloat(this.state.content[i].grid.x / 100) * this.state.duration;
      videoClips.push({
        i: i,
        startTime: startTime,
        endTime: endTime,
        url: this.state.url,
      });
      allClips.push({
        i: i,
        url: "",
        duration: 0,
      });
      var perc = parseFloat(this.state.content[i].grid.w) / 100;
      var clipTime = perc * this.state.duration;
      var numOfGifs = clipTime / this.state.content[i].duration;
      var numOfGifsInt = Math.floor(numOfGifs);
      for (var j = 0; j < numOfGifsInt; j++) {
        allClips.push({
          i: -1,
          url: this.state.content[i].url,
          duration: 0,
        })
      }
      if (numOfGifs - numOfGifsInt > 0) {
        var diff = numOfGifs - numOfGifsInt;
        var secLeft = diff * this.state.content[i].duration;
        allClips.push({
          i: -1,
          url: this.state.content[i].url,
          duration: secLeft
        });
      }
      startTime = parseFloat((this.state.content[i].grid.x + this.state.content[i].grid.w) / 100) * this.state.duration;
    }

    var length = videoClips.length;

    videoClips.push({
      i: length,
      startTime: startTime,
      endTime: this.state.duration,
      url: this.state.url,
    });

    allClips.push({
      i: length,
      url: "",
      duration: 0,
    });

    var count = 0;
    var self = this;
    var audioUrl = 'https://openmic-test.s3.us-west-2.amazonaws.com/39_1563471031477.mp3';
    BackendManager.makeQuery('clip/create', JSON.stringify({
      audio_url: audioUrl,
      all_clips: allClips,
      video_clips: videoClips,
      user_id: UserManager.id,
      title: 'big test',
    }))
    .then(data => {
      console.log(data);
      if (data.success) {

      }
    });
    // videoClips.forEach(function(clip, index) {
    //   BackendManager.makeQuery('trim/video/mute', JSON.stringify({
    //     url: self.state.url,
    //     start_time: clip.startTime,
    //     duration: clip.endTime - clip.startTime,
    //     user_id: UserManager.id,
    //   }))
    //   .then(data => {
    //     if (data.success) {
    //       count += 1;
    //       var clipUrl = BackendManager.fileUrl + data.title;
    //       for (var j = 0; j < allClips.length; j++) {
    //         if (allClips[j].i == clip.i) {
    //           console.log(allClips[j]);
    //           allClips[j].url = clipUrl;
    //         }
    //       }
    //       if (count == videoClips.length) {
    //         BackendManager.makeQuery('clip', JSON.stringify({
    //           audio_url: audioUrl,
    //           frames: allClips,
    //           user_id: UserManager.id,
    //           title: 'big test',
    //         }))
    //         .then(data => {
    //           console.log(data);
    //           if (data.success) {
    //
    //           }
    //         });
    //       }
    //     }
    //   });
    // });
    // BackendManager.makeQuery('extract/audio', JSON.stringify({
    //   url: self.state.url,
    //   user_id: UserManager.id,
    // }))
    // .then(data => {
    //   console.log(data);
    //   if (data.success) {
    //     var audioUrl = BackendManager.fileUrl + data.title;
    //     videoClips.forEach(function(clip, index) {
    //       BackendManager.makeQuery('trim/video/mute', JSON.stringify({
    //   			url: self.state.url,
    //   			start_time: clip.startTime,
    //   			duration: clip.endTime - clip.startTime,
    //   			user_id: UserManager.id,
    //   		}))
    //   		.then(data => {
    //   			if (data.success) {
    //           count += 1;
    //   				var clipUrl = BackendManager.fileUrl + data.title;
    //           for (var j = 0; j < allClips.length; j++) {
    //             if (allClips[j].i == clip.i) {
    //               console.log(allClips[j]);
    //               allClips[j].url = clipUrl;
    //             }
    //           }
    //           if (count == videoClips.length) {
    //             BackendManager.makeQuery('clip', JSON.stringify({
    //               audio_url: audioUrl,
    //               frames: allClips,
    //               user_id: UserManager.id,
    //               title: 'big test',
    //             }))
    //             .then(data => {
    //               console.log(data);
    //               if (data.success) {
    //
    //               }
    //             });
    //           }
    //   			}
    //   		});
    //     });
    //   }
    // });

  }

  renderContentItem(item) {
    return (
      <div style={validGif} key={item.i} data-grid={item.grid}>
        <span
          className="remove"
          style={removeStyle}
          onClick={this.handleRemoveContentItem.bind(this, item.i)}
        >
          x
        </span>
      </div>
    );
  }

  handleRemoveContentItem(id) {
    var content = this.state.content;
    var removedIndex = 0;
    for (var i = 0; i < content.length; i++) {
      if (content[i].i == id) {
        removedIndex = i;
        content.splice(i, 1);
        break;
      }
    }

    for (var i = removedIndex; i < content.length; i++) {
      content[i].index -= 1;
    }

    this.setState({
      content: content
    });
  }

  handleGridClick(index) {
    this.setState({
      selectedContent: this.state.searchedContent[index],
      contentModalIsOpen: true,
    });
  }

  resizeVideo() {
    uniqueCounter += 1;
    var content = {
      i: uniqueCounter,
      grid: {
        x: 0,
        y: 0,
        w: 10,
        h: 2,
      },
      url: this.state.selectedContent.mp4Url,
      duration: parseFloat(this.state.selectedContent.numFrames / this.state.selectedContent.frameRate),
    }

    var size = 0;
    for (var i = 0; i < this.state.content.length; i++) {
      size += this.state.content[i].grid.w;
    }

    BackendManager.makeQuery('resize', JSON.stringify({
      gif_id: this.state.selectedContent.gfyId,
      url: this.state.selectedContent.mp4Url
    }))
    .then(data => {
      if (data.success) {
        content.url = BackendManager.gifUrl + data.title;
        BackendManager.makeQuery('gifs/create', JSON.stringify({
          gif_id: this.state.selectedContent.gfyId,
          url: content.url,
        }))
        .then(data => {
          if (data.success) {
            this.closeContentModal();
            var c = this.state.content;
            c.push(content);
            this.setState({
              content: c,
            });
          }
        });
      }
    });
  }

  closeContentModal() {
    this.setState({
      contentModalIsOpen: false,
    });
  }

	renderContentView(classes) {
		if (this.state.url != "") {
			return (
				<div style={{marginRight: 20, marginTop: 20, backgroundColor: '#30343E', borderRadius: 5}}>
					<h3 style={{margin: 20, color: '#FFFFFF', paddingTop: 20}}>{"Add Content"}</h3>
					{this.renderPlayPause()}
					{this.renderProgressStr()}
          <div style={{position: 'relative'}}>
            <div style={{marginLeft: 20, marginRight: 20, marginTop: 15,
              height: '60px', border: '2px solid grey', borderRadius: '5px', borderStyle: 'dotted'}}>
              <h3 style={{color: 'grey', textAlign: 'center'}}>{"Images and GIFs go here"}</h3>
            </div>
            <ReactGridLayout
  						onLayoutChange={this.onLayoutChange}
  						onResize={this.onResize}
  						onDragStop={this.onDragStop}
  						margin={[0,1]}
  						style={{marginTop: 2, marginLeft: 20, marginRight: 20, position: 'absolute', top: 0, left: 0, right: 0}}
  						{...this.props}
  					>
  						{_.map(this.state.content, item => this.renderContentItem(item))}
  					</ReactGridLayout>
          </div>
					<div style={{marginLeft: 20, marginRight: 20}}>
						{this.renderSlider()}
					</div>
          <div style={{marginLeft: 20, marginRight: 20}}>
            <TextField
              id="outlined-adornment-amount"
              label="Search GIFs and Memes"
              fullWidth
              value={this.state.searchQuery}
              InputProps={{ classes: { root: classes.textFieldInputRoot } }}
              InputLabelProps={{
                FormLabelClasses: {
                  root: classes.textFieldLabelRoot
                }
              }}
              onChange={this.handleSearchChange}
              margin="normal"
              variant="outlined"
            />
            <div style={root}>
              <GridList cellHeight={160} fullWidth cols={5}>
                {this.state.searchedContent.map((content, index) => (
                  <GridListTile key={content.gfyId} onClick={() => this.handleGridClick(index)}>
                    <img src={content.posterUrl} alt={content.gfyName} />
                  </GridListTile>
                ))}
              </GridList>
            </div>
          </div>
					<button className="button-red" style={{margin: 20, float: 'right'}} onClick={() => this.handleTrimClick()}>{"Done"}</button>
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
		if (this.state.url != "") {
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

  handleSearchChange(e) {
    this.setState({
      searchQuery: e.target.value
    });
    var url = "https://api.gfycat.com/v1/gfycats/search?search_text=";
    var urlEnd = "&count=50";
    fetch(url + e.target.value + urlEnd, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.gifToken,
      },
    })
    .then((resp) => resp.json())
    .then(data => {
      console.log(data);
      this.setState({
        searchedContent: data.gfycats,
      });
    });
  }

	renderView(classes) {
    return (
      <div>
        <div style={{float: 'left'}}>
          {this.renderVideoPlayer()}
        </div>
        <div style={{marginLeft: 390}}>
          {this.renderContentView(classes)}
        </div>
      </div>
    );
	}

  render() {
    const { classes } = this.props;
		return (
      <div>
        <Modal
          isOpen={this.state.contentModalIsOpen}
          onRequestClose={this.closeContentModal}
          style={customStylesLight}
          contentLabel="Content"
        >
          <ContentModal
            content={this.state.selectedContent}
            resizeVideo={this.resizeVideo}
            closeContentModal={this.closeContentModal}
          />
        </Modal>
				{this.renderView(classes)}
      </div>
    )
  }
}

export default withStyles(styles)(EditorPage);
