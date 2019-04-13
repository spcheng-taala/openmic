import React, { Component } from 'react';
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


class TranscribePage extends Component {

  componentDidMount() {
    var clip = localStorage.getItem('clip');
    console.log(clip);
    if (clip != null) {
      this.parseTranscription();
      var clip = localStorage.getItem('clip');
      this.setState({
        id: clip.id,
        url: clip.url,
      });
      localStorage.removeItem('clip');
    } else {
      // this.props.history.push('/')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      id: 12,
      isPlaying: true,
      url: "https://openmic-test.s3.us-west-2.amazonaws.com/undefined_1554937267665.mp4",
      transcription: [],
      transcribedValue: 0,
      transcribedDuration: 0,
      scrubberShouldMove: true,
    };

    this.createMinString = this.createMinString.bind(this);
    this.renderBottomView = this.renderBottomView.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.parseTranscription = this.parseTranscription.bind(this);
    this.renderTranscriptionItem = this.renderTranscriptionItem.bind(this);
    this.handleTranscriptionStartTimeChange = this.handleTranscriptionStartTimeChange.bind(this);
    this.handleTranscriptionEndTimeChange = this.handleTranscriptionEndTimeChange.bind(this);
    this.handleTranscriptionTextChange = this.handleTranscriptionTextChange.bind(this);
    this.saveCaptions = this.saveCaptions.bind(this);
    this.handleTranscriptionVideoProgress = this.handleTranscriptionVideoProgress.bind(this);
    this.handleTranscriptionProgressChange = this.handleTranscriptionProgressChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleScrubberMove = this.handleScrubberMove.bind(this);
    this.playAtTranscribedValue = this.playAtTranscribedValue.bind(this);
    this.setTranscribedPlayTime = this.setTranscribedPlayTime.bind(this);
  }

  togglePlayPause() {
    var isPlaying = !this.state.isPlaying;
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

  handleTranscriptionStartTimeChange(e, i) {
    var transcription = this.state.transcription;
    var transcribedItem = transcription[i];
    if (/^[0-9,.]*$/.test(e.target.value)) {
      transcribedItem.start_time = e.target.value;
    }
    transcription[i] = transcribedItem;
    this.setState({
      transcription: transcription,
    });
    console.log(transcription);
  }

  handleTranscriptionEndTimeChange(e, i) {
    var transcription = this.state.transcription;
    var transcribedItem = transcription[i];
    transcribedItem.end_time = e.target.value;
    transcription[i] = transcribedItem;
    this.setState({
      transcription: transcription,
    });
    console.log(transcription);
  }

  handleTranscriptionTextChange(e, i) {
    var transcription = this.state.transcription;
    var transcribedItem = transcription[i];
    transcribedItem.line = e.target.value;
    transcription[i] = transcribedItem;
    this.setState({
      transcription: transcription,
    });
    console.log(transcription);
  }

  setTranscribedPlayTime(i) {
    var transcribedItem = this.state.transcription[i];
    let seconds = transcribedItem.start_time;
    this.player.seekTo(seconds);
    this.setState({
      transcribedValue: seconds,
    });
  }

  renderTranscriptionItem(item, i) {
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
              onFocus={() => this.setTranscribedPlayTime(i)}
              onChange={(e) => this.handleTranscriptionStartTimeChange(e, i)}/>
            <TextField
              style={timeTextFieldStyle}
              label="End Time"
              margin="normal"
              variant="outlined"
              value={item.end_time}
              onFocus={() => this.setTranscribedPlayTime(i)}
              onChange={(e) => this.handleTranscriptionEndTimeChange(e, i)}/>
          </Row>
          <TextField
            multiline
            fullWidth
            style={{marginBottom: 25}}
            variant="outlined"
            value={item.line}
            onFocus={() => this.setTranscribedPlayTime(i)}
            onChange={(e) => this.handleTranscriptionTextChange(e, i)}/>
        </Col>
        <Divider/>
      </div>
    );
  }

  saveCaptions() {
    BackendManager.makeQuery('caption', JSON.stringify({
      transcription: this.state.transcription,
      url: this.state.url,
    }))
    .then(data => {
      console.log(data);
    });
  }

  handleTranscriptionVideoProgress(state) {
    var seconds = state.played * this.player.getDuration();
    if (this.state.scrubberShouldMove) {
      this.setState({
        transcribedValue: seconds,
      });
    }
  }

  handleTranscriptionProgressChange(state) {

  }

  ref = player => {
    this.player = player
  }

  handleDurationChange(duration) {
    this.setState({
      transcribedDuration: duration,
    });
  }

  handleScrubberMove(value) {
    console.log(value);
    this.setState({
      scrubberShouldMove: false,
      transcribedValue: value,
      isPlaying: false,
    });
  }

  playAtTranscribedValue(value) {
    this.setState({
      scrubberShouldMove: true,
      isPlaying: true,
    });
    this.player.seekTo(parseFloat(value));
  }

  renderBottomView() {
    return (
      <div>
        <Row style={{height: 550}}>
          <ul style={listStyle}>
            {this.state.transcription.map((item, i) => {
              return (this.renderTranscriptionItem(item, i))
            })}
          </ul>
          <div style={root}>
            <Col>
              <ReactPlayer
                ref={this.ref}
                style={{marginTop: 20}}
                url={this.state.url}
                onProgress={this.handleTranscriptionVideoProgress}
                onDuration={this.handleDurationChange}
                playing={this.state.isPlaying} />
              {this.renderPlayPause()}
              <div style={{marginTop: 20, marginRight: 25, marginLeft: 25}}>
                <InputRange
                  draggableTrack
                  maxValue={this.state.transcribedDuration}
                  minValue={0}
                  formatLabel={value => this.createMinString(value)}
                  onChange={value => this.handleScrubberMove(value)}
                  onChangeComplete={value => this.playAtTranscribedValue(value)}
                  value={this.state.transcribedValue} />
              </div>
            </Col>
          </div>
        </Row>
        <div style={buttonRoot}>
          <button className='button-rounded-gold' onClick={() => this.saveCaptions()}>
            {"Save"}
          </button>
        </div>
      </div>
    );
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

export default TranscribePage;
