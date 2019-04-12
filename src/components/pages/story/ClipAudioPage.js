import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip'
import WaveSurfer from 'wavesurfer.js';
import Ciseaux from 'ciseaux/browser';
import toWav from 'audiobuffer-to-wav';
import './assets/index.scss';
import "react-input-range/lib/css/index.css";
import { Planet } from 'react-kawaii';
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
import Divider from '@material-ui/core/Divider';
import axios from 'axios';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

const STAGE_CLIP = 0;
const STAGE_CLIPPING = 1;
const STAGE_CLIPPED = 2;
const STAGE_PUBLISHING = 3;
const STAGE_TRANSCRIPTION = 4;

var uniqueCounter = 0;

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
    if (this.state.stage == STAGE_TRANSCRIPTION) {
      this.parseTranscription();
    }
    if (url != null) {
      var clipTime = localStorage.getItem('clip_time');
      var duration = localStorage.getItem('duration');
      var storyId = localStorage.getItem('story_id');

      this.setState({
        storyId: storyId,
      });

      var startTime = clipTime - 150;
      if (startTime < 0) {
        startTime = 0;
      }

      var length = 180;
      if (length > duration) {
        length = duration;
      }

      length = Math.floor(length);

      this.setState({
        clipMax: length,
      });

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
      localStorage.removeItem('story_id');
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
        wavesurfer.on('ready', function() {
          if (self.state.stage == STAGE_CLIPPED) {

          } else {
            wavesurfer.seekTo((clipTime - 60)/duration);
          }
          self.setState({
            isPlaying: true,
          });
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
      id: 12,
      storyId: 0,
      isPlaying: false,
      clipTitle: "",
      clipMax: 180,
      value: {
        min: 0,
        max: 60,
      },
      prevMin: 0,
      prevMax: 60,
      url: "https://s3-us-west-2.amazonaws.com/pokadotmedia/25_1547597820129.064.mp4",
      audioUrl: "https://s3-us-west-2.amazonaws.com/pokadotmedia/25_1547597820129.064.mp4",
      videoUrl: "https://openmic-test.s3.us-west-2.amazonaws.com/undefined_1554937267665.mp4",
      stage: STAGE_TRANSCRIPTION,
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
      transcription: [],
      transcribedValue: 0,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
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
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.parseTranscription = this.parseTranscription.bind(this);
    this.renderTranscriptionItem = this.renderTranscriptionItem.bind(this);
    this.handleTranscriptionStartTimeChange = this.handleTranscriptionStartTimeChange.bind(this);
    this.handleTranscriptionEndTimeChange = this.handleTranscriptionEndTimeChange.bind(this);
    this.handleTranscriptionTextChange = this.handleTranscriptionTextChange.bind(this);
    this.saveCaptions = this.saveCaptions.bind(this);
    this.handleTranscriptionVideoProgress = this.handleTranscriptionVideoProgress.bind(this);
    this.handleTranscriptionProgressChange = this.handleTranscriptionProgressChange.bind(this);
  }

  handleTitleChange(e) {
    this.setState({
      clipTitle: e.target.value
    });
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
        this.setState({
          stage: STAGE_CLIPPING,
        });
        this.uploadClip(file);
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
    var self = this;
		axios.post(`http://localhost:8080/pp/upload/`, formData, {
		}).then(data => {
			var url = "https://s3-us-west-2.amazonaws.com/openmic-test/";
			var audioUrl = url + data.data.title.split(' ').join('+');
      console.log(audioUrl);
      this.setState({
        stage: STAGE_CLIPPED,
        audioUrl: audioUrl,
      });
      wavesurfer.empty();
      wavesurfer.load(audioUrl);
      BackendManager.makeQuery('clips/create', JSON.stringify({
        title: self.state.clipTitle,
        audio_url: audioUrl,
        story_id: self.state.storyId,
        user_id: UserManager.id,
        duration: self.state.value.max - self.state.value.min,
      }))
      .then(data => {
        console.log(data);
        if (data.success) {
          self.setState({
            id: data.id,
          });
          BackendManager.makeQuery('transcribe', JSON.stringify({
            url: audioUrl,
            id: data.id,
          }))
          .then(data => {
            console.log(data);
          });
        }
      });
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
    var frames = this.state.frames;
    for (var j = 0; j < frames.length; j++) {
      if (frames[j].i == i) {
        frames.splice(j, 1);
        break;
      }
    }
    this.setState({
      frames: frames
    });
    console.log(frames);
    // this.setState({ frames: _.reject(this.state.frames, { i: i }) });
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
    uniqueCounter += 1;
    var title = this.state.searchQuery;
    var self = this;
    var gif = {
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

  parseTranscription() {
    BackendManager.makeQuery('transcription', JSON.stringify({
      id: this.state.id,
    }))
    .then(data => {
      if (data.success) {
        var items = data.transcription.results.items;
        var startTime = 0;
        var endTime = 0;
        var transcription = [];
        var line = "";
        var isNewStartTime = true;
        for (var i = 0; i < items.length; i++) {
          if (items[i].type != "punctuation" && !isNewStartTime) {
            endTime = items[i].end_time;
            line += " ";
          }
          if (isNewStartTime) {
            startTime = items[i].start_time;
            isNewStartTime = false;
          }
          line += items[i].alternatives[0].content;
          if (items[i].type == "punctuation" && items[i].alternatives != null && items[i].alternatives[0].content != ",") {
            var sentence = line;
            transcription.push({
              start_time: startTime,
              end_time: endTime,
              line: sentence,
            });
            isNewStartTime = true;
            line = "";
          }
        }
        this.setState({
          transcription: transcription
        });
        console.log(transcription);
      }
    });
  }

  createVideo() {
    var totalGifs = [];
    var frames = this.state.frames;
    // frames.sort((a,b) => (a.grid.x > b.grid.x) ? 1 : ((b.grid.x > a.grid.x) ? -1 : 0));
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
    console.log(frames);
    BackendManager.makeQuery('clip', JSON.stringify({
      audio_url: this.state.audioUrl,
      frames: totalGifs,
      user_id: UserManager.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        var url = "https://s3-us-west-2.amazonaws.com/openmic-test/";
        var videoUrl = url + data.title;
        this.setState({
          videoUrl: videoUrl,
        });
        BackendManager.makeQuery('clips/update', JSON.stringify({
          id: this.state.id,
          url: videoUrl
        }));
      }
    });
  }

  handleTranscriptionStartTimeChange(e, i) {

  }

  handleTranscriptionEndTimeChange(e, i) {

  }

  handleTranscriptionTextChange(e, i) {

  }

  renderTranscriptionItem(item) {
    return (
      <div>
        <Col>
          <Row>
            <TextField
              style={timeTextFieldStyle}
              label="Start Time"
              margin="normal"
              variant="outlined"
              value={item.start_time}
              onChange={this.handleSearchChange}/>
            <TextField
              style={timeTextFieldStyle}
              label="End Time"
              margin="normal"
              variant="outlined"
              value={item.end_time}
              onChange={this.handleSearchChange}/>
          </Row>
          <TextField
            multiline
            fullWidth
            style={{marginBottom: 25}}
            variant="outlined"
            value={item.line}
            onChange={this.handleSearchChange}/>
        </Col>
        <Divider/>
      </div>
    );
  }


  saveCaptions() {
    BackendManager.makeQuery('caption', JSON.stringify({
      transcription: this.state.transcription,
      url: this.state.videoUrl,
    }))
    .then(data => {
      console.log(data);
    });
  }

  handleTranscriptionVideoProgress(state) {
    var seconds = state.played * this.player.getDuration();
    this.setState({
      transcribedValue: seconds,
    });
  }

  handleTranscriptionProgressChange(state) {

  }

  ref = player => {
    this.player = player
  }

  renderBottomView() {
    if (this.state.stage == STAGE_CLIP) {
      return (
        <div>
          <div style={sliderStyle} data-tip data-for='sliderTT'>
            <InputRange
              draggableTrack
              maxValue={this.state.clipMax}
              minValue={0}
              formatLabel={value => this.createMinString(value)}
              onChange={value => this.checkValue(value)}
              onChangeComplete={value => this.playAtValue(value)}
              value={this.state.value} />
          </div>
          <ReactTooltip id="sliderTT" place="bottom" type="dark" effect="float">
            <span>Drag the blue part!</span>
          </ReactTooltip>
          <h3 style={{color: 'grey', textAlign: 'center'}}>Drag the left and right blue dots to clip</h3>
          <p style={{color: 'grey', textAlign: 'center'}}>Clips can be up to 2 minutes long</p>
          {this.renderPlayPause()}
          <div style={{margin: 50}}>
            <TextField
              label="Title"
              placeholder="Title"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.clipTitle}
              onChange={this.handleTitleChange}/>
          </div>
          <button className='button-rounded' onClick={() => this.createAudioClip()}>
            {"Clip"}
          </button>
        </div>
      );
    } else if (this.state.stage == STAGE_CLIPPING) {
      return (
        <div>
          {this.renderPlayPause()}
          <div style={sliderStyle}>
            <LinearProgress colorPrimary="#3abcbc" colorSecondary="#83d9d9" variant="determinate" value={this.state.progress} />
          </div>
          <div style={animationRoot}>
            <Planet className='floating' size={200} mood="shocked" color="#FCCB7E" />
          </div>
          <p style={{color: 'grey', textAlign: 'center'}}>{"Snip snip! We'll be done shortly!"}</p>
        </div>
      );
    } else if (this.state.stage == STAGE_CLIPPED) {
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
    } else if (this.state.stage == STAGE_PUBLISHING) {

    } else if (this.state.stage == STAGE_TRANSCRIPTION) {
      return (
        <div>
          <Row>
            <ul style={listStyle}>
              {this.state.transcription.map((item) => {
                return (this.renderTranscriptionItem(item))
              })}
            </ul>
            <Col>
              <ReactPlayer
                ref={this.ref}
                style={{marginTop: 25}}
                url={this.state.videoUrl}
                onProgress={this.handleTranscriptionVideoProgress}
                playing />
              <InputRange
                maxValue={this.player.getDuration()}
                minValue={0}
                formatLabel={value => this.createMinString(value)}
                onChangeComplete={value => this.playAtValue(value)}
                value={this.state.transcribedValue} />
            </Col>
          </Row>
          <div style={buttonRoot}>
            <button className='button-rounded-gold' onClick={() => this.saveCaptions()}>
              {"Save"}
            </button>
          </div>
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        {this.renderVideoPlayer()}
        {this.renderAddButton()}
        <div id="waveform" style={waveformStyle}></div>
        {this.renderBottomView()}
      </div>
    )
  }
}

export default ClipAudioPage;
