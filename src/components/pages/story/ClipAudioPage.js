import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Ciseaux from 'ciseaux/browser';
import toWav from 'audiobuffer-to-wav';
import './assets/index.scss';
import "react-input-range/lib/css/index.css";
import InputRange from 'react-input-range';
import ReactPlayer from 'react-player';
import GridLayout from 'react-grid-layout';
import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import _ from "lodash";
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

const STAGE_CLIP = 0;
const STAGE_CLIPPING = 1;
const STAGE_CLIPPED = 2;

const ReactGridLayout = WidthProvider(RGL);

var interval = null;

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
  paddingLeft: 10,
  marginBottom: 10,
}

const root = {
  display: 'flex',
  flexWrap: 'wrap',
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
  borderRadius: 5,
  paddingLeft: 2,
  color: 'white',
  backgroundColor: '#3ABBBC',
}

const invalidGif = {
  borderRadius: 5,
  color: 'white',
  backgroundColor: '#DD7DA5',
}

const editorStyle = {
  height: 100,
}

var wavesurfer = null;

class ClipAudioPage extends Component {

  static defaultProps = {
    isDraggable: true,
    isResizable: true,
    rowHeight: 20,
    cols: 100,
    onLayoutChange: function() {},
  };

  componentDidMount() {
    var url = localStorage.getItem('url');
    if (url != null) {
      var clipTime = localStorage.getItem('clip_time');
      var duration = localStorage.getItem('duration');
      var startTime = clipTime - 150;
      if (startTime < 0) {
        startTime = 0;
      }

      var length = 180;
      if (length > duration) {
        length = duration;
      }

      var min = 90;
      if (clipTime - 60 < 0) {
        min = 0;
      }

      var max = min + 60;
      if (max > duration) {
        max = duration;
      }

      this.setState({
        value: {
          min: min,
          max: max,
        }
      });

      localStorage.removeItem('url');
      localStorage.removeItem('clip_time');
      localStorage.removeItem('duration');
      wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        scrollParent: false,
        barWidth: 3,
      });
      var self = this;
      Ciseaux.context = new AudioContext();
      Ciseaux.from(url).then((tape) => {
        // edit tape
        tape = Ciseaux.concat([ tape.slice(startTime, length) ]);
        // render the tape to an AudioBuffer
        return tape.render();
      }).then((audioBuffer) => {
        var wavFile = toWav(audioBuffer);
        var blob = new window.Blob([ new DataView(wavFile) ], {
          type: 'audio/wav'
        });

        var url = window.URL.createObjectURL(blob);
        this.setState({
          url: url,
        });

        wavesurfer.load(url);
        // wavesurfer.load("https://s3-us-west-2.amazonaws.com/openmic-test/15538979925711553897992547.mp3");
        wavesurfer.on('ready', function() {
          if (self.state.stage == STAGE_CLIPPED) {

          } else {
            wavesurfer.seekTo((clipTime - 60)/duration);
          }
          // wavesurfer.play();
        });
        wavesurfer.on('seek', function (progress) {
          if (self.state.stage == STAGE_CLIPPED) {

          } else {
            if (progress < self.state.value.min/length) {
              wavesurfer.seekTo(self.state.value.min/length);
            } else if (progress > self.state.value.max/length) {
              wavesurfer.seekTo(self.state.value.max/length);
            }
          }
        });
        wavesurfer.on('audioprocess', function(progress) {
          console.log(progress);
          console.log('max: ' + self.state.value.max);
          if (self.state.stage == STAGE_CLIPPED) {
            for (var i = 0; i < self.state.frames.length; i++) {
              if ((progress/wavesurfer.getDuration()) > parseFloat(self.state.frames[i].grid.x)/100 &&
              (progress/wavesurfer.getDuration()) <= (parseFloat(self.state.frames[i].grid.x + self.state.frames[i].grid.w)/100)) {
                self.setState({
                  currentGif: self.state.frames[i],
                });
              }
            }
          } else {
            if (progress >= self.state.value.max) {
              wavesurfer.pause();
              wavesurfer.seekTo(self.state.value.min/length);
              wavesurfer.play();
            }
          }
        });
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      value: {
        min: 0,
        max: 60,
      },
      prevMin: 0,
      prevMax: 60,
      url: "https://s3-us-west-2.amazonaws.com/pokadotmedia/25_1547597820129.064.mp4",
      audioUrl: "https://s3-us-west-2.amazonaws.com/pokadotmedia/25_1547597820129.064.mp4",
      stage: STAGE_CLIP,
      progress: 18,
      isPlaying: false,
      interimText: '',
      finalisedText: [],
      error: '',
      gifs: [],
      currentGif: null,
      searchQuery: "",
      buttonType: 0,
      frames: [],
    };

    this.createAudioClip = this.createAudioClip.bind(this);
    this.uploadClip = this.uploadClip.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.createMinString = this.createMinString.bind(this);
    this.renderBottomView = this.renderBottomView.bind(this);
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
  }

  createAudioClip() {
    Ciseaux.context = new AudioContext();
    if (this.state.url != null) {
      Ciseaux.from(this.state.url).then((tape) => {
        // edit tape
        tape = Ciseaux.concat([ tape.slice(this.state.value.min, (this.state.value.max - this.state.value.min)) ]);
        // render the tape to an AudioBuffer
        return tape.render();
      }).then((audioBuffer) => {
        var wavFile = toWav(audioBuffer);
        var blob = new window.Blob([ new DataView(wavFile) ], {
          type: 'audio/wav'
        });
        var file = new File([blob], UserManager.id + "_" + Date.now().toString() + ".mp3");
        var url = window.URL.createObjectURL(blob);
        wavesurfer.empty();
        wavesurfer.load(url);
        wavesurfer.play();
        // this.setState({
        //   stage: STAGE_CLIPPING,
        // });
        // this.uploadClip(file);
      });
    }
  }

  updateInterval() {
    if (this.state.progress < 99) {
      this.setState({ progress: this.state.progress + 0.1 });
    }
  }

  uploadClip(file) {
    const formData = new FormData();
		formData.append('file', file);
    interval = setInterval(() => this.updateInterval(), 100);
		axios.post(`http://localhost:8080/pp/upload/`, formData, {
		}).then(data => {
			var url = "https://s3-us-west-2.amazonaws.com/openmic-test/test.mov";
			// var audioUrl = url + data.data.title.split(' ').join('+');
      // console.log(audioUrl);
      this.setState({
        stage: STAGE_CLIPPED,
      });
      wavesurfer.empty();
      wavesurfer.load(url);
			// BackendManager.makeQuery('clip', JSON.stringify({
			// 	audio_url: audioUrl,
			// 	image_url: 'https://s3-us-west-2.amazonaws.com/pokadotmedia/houston@pokadotapp.com_1547596700487.555.jpg',
			// 	user_id: UserManager.id,
			// }))
			// .then(data => {
			// 	if (data.success) {
			// 		var clipUrl = url + data.title;
			// 		BackendManager.makeQuery('clips/create', JSON.stringify({
			// 			title: "test",
      //       audio_url: audioUrl,
			// 			url: clipUrl,
			// 			story_id: 1,
			// 			user_id: UserManager.id,
			// 			duration: this.state.value.max - this.state.value.min,
			// 		}))
			// 		.then(data => {
      //       clearInterval(this.interval);
      //       this.setState({
      //         progress: 100,
      //         stage: STAGE_CLIPPED,
      //       });
      //       console.log(data);
			// 		});
			// 	}
			// });
		}).catch(error => {
			// handle your error
		});
  }

  checkValue(value) {
    if (value.min < 0) {
      value.min = 0;
    }
    if (value.max > 180) {
      value.max = 180;
    }
    if (value.min == 180) {
      value.min = 170;
    }
    if (value.max - value.min > 120) {
      if (this.state.prevMax != value.max) {
        value.max = value.min + 120;
      } else if (this.state.prevMin != value.min) {
        value.min = value.max - 120;
      }
    }
    this.setState({
      value: value,
      prevMin: value.min,
      prevMax: value.max,
    });
  }

  playAtValue(value) {
    if (wavesurfer != null) {
      wavesurfer.play(value.min, value.max);
    }
  }

  renderPlayPause() {
    if (this.state.isPlaying) {
      return (
        <img style={playPauseButtonStyle} src='../../../../../images/pause.png'/>
      );
    } else {
      return (
        <img style={playPauseButtonStyle} src='../../../../../images/play.png'/>
      );
    }
  }

  createMinString(seconds) {
    var minutes = Math.floor(seconds/60);
    var remainingSeconds = seconds - minutes * 60;
    if (remainingSeconds < 10) {
      return minutes + ":0" + remainingSeconds;
    } else {
      return minutes + ":" + remainingSeconds;
    }
  }

  renderVideoPlayer() {
    if (this.state.currentGif != null && this.state.stage == STAGE_CLIPPED) {
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
    layoutItem.h = 2;
    placeholder.h = 2;
    var hasOverlap = false;
    var difference = 0;
    for (var i = 0; i < layout.length; i++) {
      if (layout[i].i != layoutItem.i) {
        if (layoutItem.x < layout[i].x && (layoutItem.x + layoutItem.w) > layout[i].x) {
          hasOverlap = true;
          difference = layout[i].x - layoutItem.x;
        }
      }
    }

    if (hasOverlap) {
      layoutItem.w = difference;
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
      frames[layoutItem.i - 1] = newGif;

      this.setState({
        frames: frames,
      });
    }
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
      frames[layoutItem.i - 1] = newGif;

      this.setState({
        frames: frames,
        buttonType: 2,
      });
    }
  }

  renderFrameItem(item) {
    console.log(item);
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

  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ frames: _.reject(this.state.frames, { i: i }) });
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
    var title = this.state.searchQuery;
    var self = this;
    var gif = {
      i: this.state.frames.length + 1,
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
    if (this.state.frames.length > 0) {
      gif.grid.y = 2;
    }

    var gifs = self.state.frames;
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
      } else {
        BackendManager.makeQuery('resize', JSON.stringify({
          gif_id: self.state.currentGif.id,
          url: self.state.currentGif.url
        }))
        .then(data => {
          if (data.success) {
            var url = "https://s3-us-west-2.amazonaws.com/openmic-test/";
            gif.url = url + data.title;
            gifs.push(gif);
            self.setState({
              frames: gifs,
            });
            BackendManager.makeQuery('gifs/create', JSON.stringify({
              gif_id: self.state.currentGif.id,
              url: url + data.title,
            }));
          }
        });
      }
    });

    console.log(gif);

    window.scrollTo(0, 0);
  }

  renderAddButton() {
    if (this.state.buttonType == 1) {
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
    // frames.sort((a,b) => (a.grid.x > b.grid.x) ? 1 : ((b.grid.x > a.grid.x) ? -1 : 0));
    console.log(this.state.frames);
    for (var i = 0; i < frames.length; i++) {
      var perc = parseFloat(frames[i].grid.w)/100;
      var clipTime = perc * wavesurfer.getDuration();
      // var gifToAdd = {
      //   url: frames[i].url,
      //   loop: clipTime,
      // }
      // totalGifs.push(gifToAdd);
      // totalGifs.push(gifToAdd);
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
    console.log(frames);
    BackendManager.makeQuery('clip', JSON.stringify({
      frames: totalGifs,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {

      }
    });
  }

  renderBottomView() {
    if (this.state.stage == STAGE_CLIP) {
      return (
        <div>
          <div style={{position: 'relative'}}>
            <div style={sliderStyle}>
              <InputRange
                style={editorStyle}
                draggableTrack
                maxValue={180}
                minValue={0}
                formatLabel={value => this.createMinString(value)}
                onChange={value => this.checkValue(value)}
                onChangeComplete={value => this.playAtValue(value)}
                value={this.state.value} />
              <div id="waveform" style={waveformStyle}></div>
            </div>
          </div>
          <button className='button-rounded' onClick={() => this.createAudioClip()}>
            {"Clip"}
          </button>
        </div>
      );
    } else if (this.state.stage == STAGE_CLIPPING) {
      return (
        <div>
          <div style={sliderStyle}>
            <LinearProgress variant="determinate" value={this.state.progress} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={{position: 'relative'}}>
            <div style={{marginLeft: 50, marginRight: 50, marginTop: 15, marginBottom: 5,
              height: '60px', border: '2px solid grey', borderRadius: '5px', borderStyle: 'dotted'}}>
              <h3 style={{color: 'grey', textAlign: 'center'}}>GIFs go here</h3>
            </div>
            <div style={{marginLeft: 50, marginRight: 50,
              height: '60px', border: '2px solid grey', borderRadius: '5px', borderStyle: 'dotted'}}>
              <h3 style={{color: 'grey', textAlign: 'center'}}>Drag GIFs up from here</h3>
            </div>
            <ReactGridLayout
              onLayoutChange={this.onLayoutChange}
              onResize={this.onResize}
              onDragStop={this.onDragStop}
              style={{marginLeft: 50, marginRight: 50, position: 'absolute', top: 0, width: '100%'}}
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
      )
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        {this.renderVideoPlayer()}
        {this.renderAddButton()}
        
        {this.renderBottomView()}
      </div>
    )
  }
}

export default ClipAudioPage;
