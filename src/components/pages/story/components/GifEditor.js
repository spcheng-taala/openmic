import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import WaveSurfer from 'wavesurfer.js';
import toWav from 'audiobuffer-to-wav';
import Modal from 'react-modal';
import '../assets/index.scss';
import "react-input-range/lib/css/index.css";
import { Planet } from 'react-kawaii';
import ReactPlayer from 'react-player';
import GridLayout from 'react-grid-layout';
import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import _ from "lodash";
import LoadingModal from './LoadingModal.js';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import UserManager from '../../../singletons/UserManager.js';
import BackendManager from '../../../singletons/BackendManager.js';

const STAGE_VERIFYING = 0;
const STAGE_GIF = 1;
const STAGE_PUBLISHING = 2;

var uniqueCounter = 0;

const ReactGridLayout = WidthProvider(RGL);

var interval = null;

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

const gridList = {
	marginLeft: 20,
	marginTop: 20,
  width: 220,
  height: 70,
}

const waveformStyle = {
  marginLeft: 50,
  marginRight: 50,
}

const sliderStyle = {
  margin: 50,
}

const playPauseButtonStyle = {
  width: 60,
  height: 60,
  marginBottom: 10,
  cursor: 'pointer',
}

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

const animationRoot = {
  display: 'flex',
  flexWrap: 'wrap',
  height: 250,
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,

}

const buttonRoot = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
}

const removeStyle = {
  position: "absolute",
  right: "2px",
  top: 0,
  cursor: "pointer"
};

const validGif = {
  margin: 0,
  borderRadius: 5,
  paddingLeft: 2,
  color: 'white',
  backgroundColor: '#3ABBBC',
}

const invalidGif = {
  margin: 0,
  borderRadius: 5,
  color: 'white',
  backgroundColor: '#DD7DA5',
}

const editorStyle = {
  height: 100,
}

const listStyle = {
  marginTop: 25,
  width: 400,
  height: 470,
  overflow: 'scroll',
  overflowX: 'hidden',
}

const timeTextFieldStyle = {
  width: 100,
}

const timeTextFiledFontStyle = {
  font: 'Lato',
  fontSize: 14,
}

var active = {
  color: '#CF5085',
  fontWeight: 'bold',
	cursor: 'pointer',
}

var inactive = {
  color: 'grey',
  fontWeight: 'normal',
	cursor: 'pointer',
}

var wavesurfer = null;

class GifEditor extends Component {

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
    var self = this;
    BackendManager.refreshToken = localStorage.getItem('refresh_token');
    BackendManager.updateToken().then(data => {
      BackendManager.makeQuery('clips/check', JSON.stringify({
        clip_id: this.props.id,
      }))
      .then(data => {
        if (data.success) {
          if (data.user_id == UserManager.id) {
            this.setState({
              stage: STAGE_GIF,
            });
            var ctx = document.createElement('canvas').getContext('2d');
            var linGrad = ctx.createLinearGradient(0, 64, 0, 200);
            linGrad.addColorStop(0.5, 'rgba(223, 131, 170, 1.000)');
            linGrad.addColorStop(0.5, 'rgba(237, 185, 207, 1.000)');
            var progressGrad = ctx.createLinearGradient(0, 64, 0, 200);
            progressGrad.addColorStop(0.5, 'rgba(119, 31, 68, 1.000)');
            progressGrad.addColorStop(0.5, 'rgba(209, 77, 133, 1.000)');
            wavesurfer = WaveSurfer.create({
              container: '#waveform',
              waveColor: linGrad,
              progressColor: progressGrad,
              scrollParent: false,
              barWidth: 3,
            });

            var self = this;

            BackendManager.makeQuery('clips/', JSON.stringify({
              clip_id: this.props.id,
            }))
            .then(data => {
							console.log('clips');
              console.log(data);
              if (data.success) {
                self.setState({
                  url: data.clip.audio_url,
                });
                wavesurfer.load(data.clip.audio_url);
                wavesurfer.on('ready', function() {
                  self.setState({
                    isPlaying: true,
                  });
                  wavesurfer.play();
                });
                wavesurfer.on('audioprocess', function(progress) {
                  if (self.state.stage == STAGE_GIF) {
                    for (var i = 0; i < self.state.frames.length; i++) {
                      if (self.state.frames[i] != null) {
                        if ((progress/wavesurfer.getDuration()) > parseFloat(self.state.frames[i].grid.x)/100 &&
                        (progress/wavesurfer.getDuration()) <= (parseFloat(self.state.frames[i].grid.x + self.state.frames[i].grid.w)/100)) {
                          if (!self.state.isSelectingGif) {
                            if (self.state.currentGif == null || self.state.frames[i].id != self.state.currentGif.id) {
                              self.setState({
                                currentGif: self.state.frames[i],
                              });
                            }
                          }
                        }
                      }
                    }
                  }
                });
              }
            });

            BackendManager.makeQuery('clips/gifs', JSON.stringify({
              clip_id: this.props.id,
            }))
            .then(data => {
              console.log(data);
              if (data.success) {
                var gifs = [];
                for (var i = 0; i < data.gifs.length; i++) {
                  var gif = {
                    uid: data.gifs[i].id,
                    index: i,
                    i: i,
                    id: data.gifs[i].gif_id,
                    grid: {
                      x: data.gifs[i].x,
                      y: 0,
                      w: data.gifs[i].w,
                      h: 2,
                    },
                    title: data.gifs[i].title,
                    url: data.gifs[i].url,
                    duration: 1,
                  }
                  gifs.push(gif);
                }
                uniqueCounter = data.gifs.length;
                self.setState({
                  frames: gifs,
                });
              }
            });
          }
        }
      });
    });
  }

  componentWillUnmount() {
    if (wavesurfer != null) {
      wavesurfer.stop();
    }
  }

	handleTypeClick(index) {
		if (index == 0) {
			this.setState({type: index})
		} else if (index == 1) {
			this.setState({type: index});
		}
	}

  constructor(props) {
    super(props);
    this.state = {
      id: 12,
      isPlaying: false,
      clipTitle: "",
      url: "",
      stage: STAGE_GIF,
      progress: 18,
      gifs: [],
      currentGif: null,
      searchQuery: "",
      buttonType: 0,
      frames: [],
      gifsToDelete: [],
      isSelectingGif: false,
      showAddGifModal: false,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.createMinString = this.createMinString.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.renderVideoPlayer = this.renderVideoPlayer.bind(this);
    this.renderFrameItem = this.renderFrameItem.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchFocus = this.handleSearchFocus.bind(this);
    this.handleGifClick = this.handleGifClick.bind(this);
    this.renderAddButton = this.renderAddButton.bind(this);
    this.addGif = this.addGif.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.onResize = this.onResize.bind(this);
    this.setGifDuration = this.setGifDuration.bind(this);
    this.createVideo = this.createVideo.bind(this);
    this.renderGifsText = this.renderGifsText.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.renderWavesurfer = this.renderWavesurfer.bind(this);
    this.openAddGifModal = this.openAddGifModal.bind(this);
    this.closeAddGifModal = this.closeAddGifModal.bind(this);
    this.moveArrayItem = this.moveArrayItem.bind(this);
    this.renderView = this.renderView.bind(this);
  }

  handleTitleChange(e) {
    this.setState({
      clipTitle: e.target.value
    });
  }

  updateInterval() {
    if (this.state.progress < 99) {
      this.setState({ progress: this.state.progress + 0.1 });
    }
  }

  playAtValue(value) {
    if (wavesurfer != null) {
      wavesurfer.play(value.min, value.max);
      this.setState({
        isPlaying: true,
      });
    }
  }

  togglePlayPause() {
    var isPlaying = !this.state.isPlaying;
    if (isPlaying) {
      wavesurfer.play();
    } else {
      wavesurfer.pause();
    }
    this.setState({
      isPlaying: isPlaying,
    });
  }

  renderPlayPause() {
    if (this.state.isPlaying) {
      return (
        <div style={root}>
          <img style={playPauseButtonStyle} src='../../../../../images/pause.png' onClick={() => this.togglePlayPause()}/>
        </div>
      );
    } else {
      return (
        <div style={root}>
          <img style={playPauseButtonStyle} src='../../../../../images/play.png' onClick={() => this.togglePlayPause()}/>
        </div>
      );
    }
  }

  createMinString(seconds) {
    var minutes = Math.floor(seconds/60);
    var remainingSeconds = Math.floor(seconds - minutes * 60);
    if (remainingSeconds < 10) {
      return minutes + ":0" + remainingSeconds;
    } else {
      return minutes + ":" + remainingSeconds;
    }
  }

  renderVideoPlayer() {
    if (this.state.currentGif != null && this.state.stage == STAGE_GIF) {
      return (
        <div style={root}>
          <ReactPlayer url={this.state.currentGif.url} playing loop onDuration={this.setGifDuration}/>
        </div>
      );
    }
  }

  onResize(layout, oldLayoutItem, layoutItem, placeholder) {
    // `oldLayoutItem` contains the state of the item before the resize.
    // You can modify `layoutItem` to enforce constraints.
    this.setState({
      isSelectingGif: false,
    });
    layoutItem.h = 2;
    placeholder.h = 2;

    var size = 0;
    for (var i = 0; i < layout.length; i++) {
      size += layout[i].w;
    }

    if (size > 100) {
      layoutItem.w = layoutItem.w - (size - 100);
    }

    wavesurfer.seekTo(layoutItem.x/100);
    wavesurfer.play();

    var gif = null;
    for (var i = 0; i < this.state.frames.length; i++) {
      if (this.state.frames[i].i == layoutItem.i) {
        gif = this.state.frames[i];
      }
    }

    if (gif != null) {
      var newGif = {
        uid: gif.uid,
        index: gif.index,
        i: layoutItem.i,
        id: gif.id,
        grid: {
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        },
        title: gif.title,
        url: gif.url,
        duration: gif.duration,
      }

      var frames = this.state.frames;
      frames[gif.index] = newGif;

      this.setState({
        frames: frames,
      });
    }
  }

  moveArrayItem(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        var k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
  }

  onDragStop(layout, oldLayoutItem, layoutItem, placeholder) {
    this.setState({
      isSelectingGif: false,
    });
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
      // layoutItem.x = oldLayoutItem.x;
      layoutItem.y = oldLayoutItem.y;
    }

    wavesurfer.seekTo(layoutItem.x/100);
    wavesurfer.play();

    var gif = null;
    for (var i = 0; i < this.state.frames.length; i++) {
      if (this.state.frames[i].i == layoutItem.i) {
        gif = this.state.frames[i];
      }
    }

    if (gif != null) {
      var newGif = {
        uid: gif.uid,
        index: gif.index,
        i: layoutItem.i,
        id: gif.id,
        grid: {
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        },
        title: gif.title,
        url: gif.url,
        duration: gif.duration,
      }

      var frames = this.state.frames;
      frames[gif.index] = newGif;

      this.setState({
        frames: frames,
        buttonType: 2,
      });
    }
  }

  renderFrameItem(item) {
    if (item.grid.y > 0 && this.state.frames.length > 1) {
      return (
        <div style={invalidGif} key={item.i} data-grid={item.grid}>
          <span className="text" style={{color: 'white'}}>{item.title}</span>
          <span
            className="remove"
            style={removeStyle}
            onClick={this.onRemoveItem.bind(this, item.i)}
          >
            x
          </span>
        </div>
      );
    } else {
      return (
        <div style={validGif} key={item.i} data-grid={item.grid}>
          <span className="text" style={{color: 'white'}}>{item.title}</span>
          <span
            className="remove"
            style={removeStyle}
            onClick={this.onRemoveItem.bind(this, item.i)}
          >
            x
          </span>
        </div>
      );
    }
  }

  onRemoveItem(id) {
    var frames = this.state.frames;
    var removedIndex = 0;
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].i == id) {
        if (frames[i].uid > 0) {
          var gifsToDelete = this.state.gifsToDelete;
          var gifToDelete = {id: frames[i].uid};
          gifsToDelete.push(gifToDelete);
        }
        removedIndex = i;
        frames.splice(i, 1);
        break;
      }
    }

    for (var i = removedIndex; i < frames.length; i++) {
      frames[i].index -= 1;
    }

    this.setState({
      frames: frames
    });
  }

  renderGifsText() {
    if (this.state.gifs.length > 0) {
      return (
        <h3 style={{color: 'grey', textAlign: 'center'}}>Select the GIF you like!</h3>
      );
    }
  }

  handleSearchChange(e) {
    this.setState({
      searchQuery: e.target.value
    });
    var url = "https://api.giphy.com/v1/gifs/search?api_key=C7NH87Z3hMV6CpDSF0XaJsThTINRg3wc&q=";
    var urlEnd = "&limit=50&offset=0&rating=PG-13&lang=en";
    fetch(url + e.target.value + urlEnd, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((resp) => resp.json())
    .then(data => {
      var gifs = [];
      for (var i = 0; i < data.data.length; i++) {
        var gif = {
          index: i,
          url: data.data[i].images.original.mp4,
          id: data.data[i].id,
          image: data.data[i].images['480w_still'].url,
          duration: 1,
        }
        gifs.push(gif);
      }
      this.setState({
        gifs: gifs,
      })
    });
  }

  handleSearchFocus() {
    if (wavesurfer != null) {
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
      }
    }
  }

  handleGifClick(index) {
    var gif = this.state.gifs[index];
    this.setState({
      currentGif: gif,
      buttonType: 1,
      isSelectingGif: true,
    });
    window.scrollTo(0, 0);
  }

  setGifDuration(duration) {
    var gif = this.state.currentGif;
    gif.duration = duration;
    this.setState({
      currentGif: gif,
    });
  }

  addGif() {
    this.setState({
      isSelectingGif: false,
    });
    uniqueCounter += 1;
    console.log('adding ' + uniqueCounter);
    var title = this.state.searchQuery;
    var gif = {
      uid: 0,
      index: this.state.frames.length,
      i: uniqueCounter,
      id: this.state.currentGif.id,
      grid: {
        x: 0,
        y: 0,
        w: 10,
        h: 2,
      },
      title: title,
      url: this.state.currentGif.url,
      duration: this.state.currentGif.duration,
    }

    var size = 0;
    for (var i = 0; i < this.state.frames.length; i++) {
      if (this.state.frames[i].grid.y == 0) {
        size += this.state.frames[i].grid.w;
      }
    }

    if (size < 100) {
      console.log(size);
      gif.grid.x = size;
      if (100 - size < 10) {
        gif.grid.w = 100 - size;
      }
      var gifs = this.state.frames;
      var self = this;
      BackendManager.makeQuery('gifs', JSON.stringify({
        gif_id: this.state.currentGif.id,
      }))
      .then(data => {
        if (data.success) {
          gif.url = data.url;
          gifs.push(gif);
          self.setState({
            frames: gifs,
          });
          console.log(gifs);
        } else {
          this.openAddGifModal();
          BackendManager.makeQuery('resize', JSON.stringify({
            gif_id: self.state.currentGif.id,
            url: self.state.currentGif.url
          }))
          .then(data => {
            if (data.success) {
              this.closeAddGifModal();
              var url = "https://s3-us-west-2.amazonaws.com/openmic-gifs/";
              gif.url = url + data.title;
              gifs.push(gif);
              self.setState({
                frames: gifs,
              });
              console.log(gifs);
              BackendManager.makeQuery('gifs/create', JSON.stringify({
                gif_id: self.state.currentGif.id,
                url: url + data.title,
              }));
            }
          });
        }
      });
    }
  }

  renderAddButton() {
    if (this.state.buttonType == 1 && this.state.stage == STAGE_GIF) {
      return (
        <div style={buttonRoot}>
          <button className='button-green' onClick={() => this.addGif()}>
            {"Add GIF"}
          </button>
        </div>
      )
    }
  }

  createVideo() {
    var totalGifs = [];
    var frames = this.state.frames;
    frames.sort((a,b) => (a.grid.x > b.grid.x) ? 1 : ((b.grid.x > a.grid.x) ? -1 : 0));

    for (var i = 0; i < frames.length; i++) {
      var perc = parseFloat(frames[i].grid.w)/100;
      var clipTime = perc * wavesurfer.getDuration();
      var numOfGifs = clipTime/frames[i].duration;
      var numOfGifsInt = Math.floor(numOfGifs);
      for (var j = 0; j < numOfGifsInt; j++) {
        var gifToAdd = {
          url: frames[i].url,
          duration: 0,
        }
        totalGifs.push(gifToAdd);
      }
      if (numOfGifs - numOfGifsInt > 0) {
        var diff = numOfGifs - numOfGifsInt;
        var secLeft = diff * frames[i].duration;
        var gifToAdd = {
          url: frames[i].url,
          duration: secLeft,
        }
        totalGifs.push(gifToAdd);
      }
    }

    this.setState({
      stage: STAGE_PUBLISHING
    });

    interval = setInterval(() => this.updateInterval(), 100);

    wavesurfer.stop();

    if (this.state.gifsToDelete.length > 0) {
      BackendManager.makeQuery('clips/gifs/delete', JSON.stringify({
        ids: this.state.gifsToDelete,
      }))
      .then(data => {
        console.log(this.state.gifsToDelete);
        console.log(data);
      });
    }

    var existingGifs = [];
    var newGifs = [];
    for (var i = 0; i < frames.length; i++) {
      var gif = {
        id: frames[i].uid,
        clip_id: this.state.id,
        gif_id: frames[i].id,
        title: frames[i].title,
        x: frames[i].grid.x,
        w: frames[i].grid.w,
      };

      if (frames[i].uid > 0) {
        existingGifs.push(gif);
      } else {
        newGifs.push(gif);
      }
    }

    if (existingGifs.length > 0) {
      BackendManager.makeQuery('clips/gifs/update', JSON.stringify({
        gifs: existingGifs,
      }))
      .then(data => {
        console.log(data);
      });
    }

    if (newGifs.length > 0) {
      BackendManager.makeQuery('clips/gifs/create', JSON.stringify({
        gifs: newGifs,
      }))
      .then(data => {
        console.log(data);
      });
    }

    BackendManager.makeQuery('clip', JSON.stringify({
      audio_url: this.state.url,
      frames: totalGifs,
      user_id: UserManager.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        var videoUrl = BackendManager.fileUrl + data.title;
        BackendManager.makeQuery('clips/update/video', JSON.stringify({
          id: this.props.id,
          video_url: videoUrl
        }))
        .then(data => {
          this.props.switchToCaptions();
        });
      }
    });
  }

  renderWavesurfer() {
    if (this.state.stage != STAGE_PUBLISHING) {
      return (
        <div id="waveform" style={waveformStyle}></div>
      );
    }
  }

  openAddGifModal() {
    this.setState({
      showAddGifModal: true
    });
  }

  closeAddGifModal() {
    this.setState({
      showAddGifModal: false
    });
  }

  renderView() {
    if (this.state.stage == STAGE_GIF) {
      return (
        <div>
          <div style={{position: 'relative'}}>
            <div style={{marginLeft: 49, marginRight: 49, marginTop: 15,
              height: '60px', border: '2px solid grey', borderRadius: '5px', borderStyle: 'dotted'}}>
              <h3 style={{color: 'grey', textAlign: 'center'}}>GIFs go here</h3>
            </div>
            <ReactGridLayout
              onLayoutChange={this.onLayoutChange}
              onResize={this.onResize}
              onDragStop={this.onDragStop}
              margin={[0,1]}
              style={{marginTop: 2, marginLeft: 50, marginRight: 50, position: 'absolute', top: 0, left: 0, right: 0}}
              {...this.props}
            >
              {_.map(this.state.frames, item => this.renderFrameItem(item))}
            </ReactGridLayout>
          </div>
          <div style={buttonRoot}>
            <button className='button-rounded-gold' onClick={() => this.createVideo()}>
              {"Publish"}
            </button>
          </div>
          <div style={{margin: 50}}>
            <TextField
              label="Search GIFs"
              placeholder="Search"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.searchQuery}
              onChange={this.handleSearchChange}
              onFocus={this.handleSearchFocus} />
          </div>
          {this.renderGifsText()}
          <div style={root}>
            <GridList cellHeight={160} fullWidth cols={5}>
              {this.state.gifs.map(gif => (
                <GridListTile key={gif.id} onClick={() => this.handleGifClick(gif.index)}>
                  <img src={gif.image} alt={gif.title} />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={sliderStyle}>
            <LinearProgress variant="determinate" value={this.state.progress} />
          </div>
          <div style={animationRoot}>
            <Planet className='floating' size={200} mood="shocked" color="#FCCB7E" />
          </div>
          <p style={{color: 'grey', textAlign: 'center'}}>{"Publishing your clip!"}</p>
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        <Modal
          isOpen={this.state.showAddGifModal}
          contentLabel="Adding Gif"
          style={customStyles}
        >
          <LoadingModal text={"Adding your Gif! Give us one sec..."}/>
        </Modal>
        {this.renderVideoPlayer()}
        {this.renderAddButton()}
        {this.renderWavesurfer()}
        {this.renderView()}
      </div>
    )
  }
}

export default GifEditor;
