import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Ciseaux from 'ciseaux/browser';
import toWav from 'audiobuffer-to-wav';
import './assets/index.scss';
import "react-input-range/lib/css/index.css";
import InputRange from 'react-input-range';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

const STAGE_CLIP = 0;
const STAGE_CLIPPING = 1;
const STAGE_CLIPPED = 2;

var interval = null;

const waveformStyle = {
  marginLeft: 50,
  marginRight: 50,
}

const sliderStyle = {
  margin: 50,
}

var wavesurfer = null;

class ClipAudioPage extends Component {

  componentDidMount() {
    wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      scrollParent: false,
      barWidth: 3,
    });
    var self = this;
    Ciseaux.context = new AudioContext();
    Ciseaux.from("https://s3-us-west-2.amazonaws.com/pokadotmedia/mbb_part2.mp3").then((tape) => {
      // edit tape
      tape = Ciseaux.concat([ tape.slice(0, 180) ]);

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
        wavesurfer.play();
      });
      wavesurfer.on('seek', function (progress) {
        if (progress < self.state.value.min/180) {
          wavesurfer.seekTo(self.state.value.min/180);
        } else if (progress > self.state.value.max/180) {
          wavesurfer.seekTo(self.state.value.max/180);
        }
      });
      wavesurfer.on('audioprocess', function(progress) {
        if (progress > self.state.value.max) {
          wavesurfer.pause();
          wavesurfer.seekTo(self.state.value.min/180);
          wavesurfer.play();
        }
      });
    });
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
      url: null,
      audioUrl: null,
      stage: STAGE_CLIP,
      progress: 18,
    };

    this.createAudioClip = this.createAudioClip.bind(this);
    this.uploadClip = this.uploadClip.bind(this);
    this.checkValue = this.checkValue.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.createMinString = this.createMinString.bind(this);
    this.renderBottomView = this.renderBottomView.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
  }

  createAudioClip() {
    Ciseaux.context = new AudioContext();
    if (this.state.url != null) {
      Ciseaux.from(this.state.url).then((tape) => {
        // edit tape
        tape = Ciseaux.concat([ tape.slice(this.state.value.min, this.state.value.max) ]);

        // render the tape to an AudioBuffer
        return tape.render();
      }).then((audioBuffer) => {
        var wavFile = toWav(audioBuffer);
        var blob = new window.Blob([ new DataView(wavFile) ], {
          type: 'audio/wav'
        });
        var file = new File([blob], Date.now().toString() + ".mp3");
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
		axios.post(`http://localhost:8080/pp/upload/`, formData, {
		}).then(data => {
			var url = "https://s3-us-west-2.amazonaws.com/openmic-test/";
			var clipUrl = url + data.data.title.split(' ').join('+');
			BackendManager.makeQuery('clip', JSON.stringify({
				audio_url: clipUrl,
				image_url: 'https://s3-us-west-2.amazonaws.com/pokadotmedia/houston@pokadotapp.com_1547596700487.555.jpg',
				user_id: UserManager.id,
			}))
			.then(data => {
				if (data.success) {
					var clipUrl = url + data.title;
					BackendManager.makeQuery('clips/create', JSON.stringify({
						title: "test",
						url: clipUrl,
						story_id: 1,
						user_id: UserManager.id,
						duration: this.state.value.max - this.state.value.min,
					}))
					.then(data => {
            clearInterval(this.interval);
            this.setState({
              progress: 100,
              stage: STAGE_CLIPPED,
            });
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

  createMinString(seconds) {
    var minutes = Math.floor(seconds/60);
    var remainingSeconds = seconds - minutes * 60;
    if (remainingSeconds < 10) {
      return minutes + ":0" + remainingSeconds;
    } else {
      return minutes + ":" + remainingSeconds;
    }
  }

  renderBottomView() {
    if (this.state.stage == STAGE_CLIP) {
      return (
        <div>
          <div id="waveform" style={waveformStyle}></div>
          <div style={sliderStyle}>
            <InputRange
              draggableTrack
              maxValue={180}
              minValue={0}
              formatLabel={value => this.createMinString(value)}
              onChange={value => this.checkValue(value)}
              onChangeComplete={value => this.playAtValue(value)}
              value={this.state.value} />
          </div>
          <button className='button-rounded' onClick={() => this.createAudioClip()}>
            {"Publish"}
          </button>
        </div>
      );
    } else if (this.state.stage == STAGE_CLIPPING) {
      return (
        <div>
          <div id="waveform" style={waveformStyle}></div>
          <div style={sliderStyle}>
            <LinearProgress variant="determinate" value={this.state.progress} />
          </div>
        </div>
      );
    } else {

    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        {this.renderBottomView()}
      </div>
    )
  }
}

export default ClipAudioPage;
