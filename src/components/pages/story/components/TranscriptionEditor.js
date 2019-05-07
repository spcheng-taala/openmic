import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import TwitterLogin from 'react-twitter-auth';
import '../assets/index.scss';
import "react-input-range/lib/css/index.css";
import { Ghost } from 'react-kawaii';
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
import UserManager from '../../../singletons/UserManager.js';
import BackendManager from '../../../singletons/BackendManager.js';

const STAGE_TRANSCRIBING = 0;
const STAGE_PUBLISHING = 1;

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
  cursor: 'pointer',
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

const timeTextFiledFontStyle = {
  font: 'Lato',
  fontSize: 14,
}

class TranscriptionEditor extends Component {

  componentDidMount() {
    BackendManager.makeQuery('clips/transcription', JSON.stringify({
      clip_id: this.props.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          id: this.props.id,
          transcription: data.transcription,
        });
      }
    });
    BackendManager.makeQuery('clips/', JSON.stringify({
      clip_id: this.props.id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          url: data.clip.video_url,
        });
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      id: 33,
      stage: STAGE_TRANSCRIBING,
      isPlaying: true,
      url: "",
      transcriptionsToDelete: [],
      transcription: [],
      transcribedValue: 0,
      transcribedDuration: 0,
      scrubberShouldMove: true,
      hasTranscription: false,
      progress: 18,
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
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleScrubberMove = this.handleScrubberMove.bind(this);
    this.playAtTranscribedValue = this.playAtTranscribedValue.bind(this);
    this.setTranscribedPlayTime = this.setTranscribedPlayTime.bind(this);
    this.handleAddLine = this.handleAddLine.bind(this);
    this.handleRemoveLine = this.handleRemoveLine.bind(this);
    this.renderFirstLineAddTopButton = this.renderFirstLineAddTopButton.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.renderRefreshTranscription = this.renderRefreshTranscription.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.renderLeftPanel = this.renderLeftPanel.bind(this);
  }

  updateInterval() {
    if (this.state.progress < 99) {
      this.setState({ progress: this.state.progress + 0.1 });
    }
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

  parseTranscription(id) {
    BackendManager.makeQuery('transcription', JSON.stringify({
      id: id,
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          hasTranscription: true,
        });
        var items = data.transcription.results.items;
        var startTime = 0;
        var endTime = 0;
        var transcription = [];
        var line = "";
        var isNewStartTime = true;
        var wordsInSentence = 0;
        for (var i = 0; i < items.length; i++) {
          if (items[i].type != "punctuation") {
            endTime = items[i].end_time;
            if (!isNewStartTime) {
              line += " ";
            }
          }
          if (isNewStartTime) {
            startTime = (parseFloat(items[i].start_time) + 0.01).toString();
            isNewStartTime = false;
          }
          line += items[i].alternatives[0].content;
          wordsInSentence += 1
          if ((items[i].type == "punctuation" && items[i].alternatives != null && items[i].alternatives[0].content != ",")
            || (wordsInSentence >= 15 && (i + 1) < items.length && items[i+1].type != "punctuation")) {
            var sentence = line;
            transcription.push({
              start_time: startTime,
              end_time: endTime,
              line: sentence,
            });
            wordsInSentence = 0;
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

  handleAddLine(i) {
    var transcription = this.state.transcription;
    if (i >= 0) {
      if (i < transcription.length - 2) {
        if (transcription[i + 1].start_time - transcription[i].end_time > 0) {
          var line = {
            id: 0,
            start_time: transcription[i].end_time + 0.01,
            end_time: transcription[i + 1].start_time - 0.01,
            line: '',
          }
          transcription.splice(i + 1, 0, line);
        }
      } else {
        if (transcription[i].end_time < this.state.transcribedDuration) {
          var line = {
            id: 0,
            start_time: transcription[i].end_time + 0.01,
            end_time: this.state.transcribedDuration,
            line: '',
          }
          transcription.splice(i + 1, 0, line);
        }
      }
    } else {
      if (transcription[i + 1].start_time > 0) {
        var line = {
          id: 0,
          start_time: 0,
          end_time: transcription[i + 1].start_time - 0.01,
          line: '',
        }
        transcription.splice(i + 1, 0, line);
      }
    }

    this.setState({
      transcription: transcription,
    });
  }

  handleRemoveLine(i) {
    var transcription = this.state.transcription;
    var transcriptionsToDelete = this.state.transcriptionsToDelete;
    var transcriptionToDelete = {id: transcription.id};
    transcription.splice(i, 1);
    this.setState({
      transcriptionsToDelete: transcriptionsToDelete,
      transcription: transcription,
    });
  }

  renderFirstLineAddTopButton(i) {
    if (i == 0) {
      return (
        <img data-tip data-for='plusTopTT'
          style={{width: 30, height: 30, float: 'right', marginTop: 20, cursor: 'pointer'}}
          src='../../../../../images/plus_top.png'
          onClick={() => this.handleAddLine(-1)} />
      );
    }
  }

  renderTranscriptionItem(item, i) {
    return (
      <div>
        <Col>
          <Row>
            <TextField
              style={{width: 100}}
              label="Start Time"
              margin="normal"
              variant="outlined"
              value={item.start_time}
              onFocus={() => this.setTranscribedPlayTime(i)}
              onChange={(e) => this.handleTranscriptionStartTimeChange(e, i)}/>
            <TextField
              style={{width: 100, marginRight: 20}}
              label="End Time"
              margin="normal"
              variant="outlined"
              value={item.end_time}
              onFocus={() => this.setTranscribedPlayTime(i)}
              onChange={(e) => this.handleTranscriptionEndTimeChange(e, i)}/>
            {this.renderFirstLineAddTopButton(i)}
            <img data-tip data-for='plusTT'
              style={{width: 30, height: 30, float: 'right', marginTop: 20, cursor: 'pointer'}}
              src='../../../../../images/plus_green.png'
              onClick={() => this.handleAddLine(i)} />
            <img data-tip data-for='trashTT'
              style={{width: 30, height: 30, float: 'right', marginTop: 20, cursor: 'pointer'}}
              src='../../../../../images/trash.png'
              onClick={() => this.handleRemoveLine(i)} />
            <ReactTooltip id="plusTopTT" place="bottom" type="dark" effect="float">
              <span>{"Add a new line above!"}</span>
            </ReactTooltip>
            <ReactTooltip id="plusTT" place="bottom" type="dark" effect="float">
              <span>{"Add a new line below!"}</span>
            </ReactTooltip>
            <ReactTooltip id="trashTT" place="bottom" type="dark" effect="float">
              <span>{"Remove line!"}</span>
            </ReactTooltip>
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
    this.setState({
      stage: STAGE_PUBLISHING,
    });
    interval = setInterval(() => this.updateInterval(), 100);
    var captions = this.state.transcription;
    var newTranscriptions = [];
    var existingTranscriptions = [];
    for (var i = 0; i < captions.length; i++) {
      var caption = {
        clip_id: this.props.id,
        start_time: captions[i].start_time,
        end_time: captions[i].end_time,
        transcription: captions[i].line,
      }
      if (captions[i].id > 0) {
        caption.id = captions[i].id;
        existingTranscriptions.push(caption);
      } else {
        newTranscriptions.push(caption);
      }
    }

    if (this.state.transcriptionsToDelete.length > 0) {
      BackendManager.makeQuery('clips/transcription/delete', JSON.stringify({
        ids: this.state.transcriptionsToDelete,
      }))
      .then(data => {
        console.log(data);
      });
    }

    if (existingTranscriptions.length > 0) {
      BackendManager.makeQuery('clips/transcription/update', JSON.stringify({
        transcriptions: existingTranscriptions,
      }))
      .then(data => {
        console.log(data);
      });
    }

    if (newTranscriptions.length > 0) {
      BackendManager.makeQuery('clips/transcription/create', JSON.stringify({
        transcriptions: newTranscriptions,
      }))
      .then(data => {
        console.log(data);
      });
    }

    BackendManager.makeQuery('caption', JSON.stringify({
      transcription: this.state.transcription,
      url: this.state.url,
      user_id: UserManager.id,
      clip_id: this.state.id,
    }))
    .then(data => {
      if (data.success) {
        var videoUrl = BackendManager.fileUrl + data.title;
        BackendManager.makeQuery('clips/update', JSON.stringify({
          id: this.state.id,
          url: videoUrl,
        }))
        .then(data => {
          if (data.success) {
            this.props.goToNewClip();
          }
        });
      }
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

  ref = player => {
    this.player = player
  }

  handleDurationChange(duration) {
    this.setState({
      transcribedDuration: duration,
    });
  }

  handleScrubberMove(value) {
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

  onSuccess(response) {
    response.json().then(body => {
      alert(JSON.stringify(body));
    });
  }

  onFailure(error) {
    alert(error);
  }

  renderLeftPanel() {
    if (this.state.transcription.length > 0) {
      return (
        <div>
          <ul style={listStyle}>
            {this.state.transcription.map((item, i) => {
              return (this.renderTranscriptionItem(item, i))
            })}
          </ul>
        </div>
      );
    } else {
      return (
        <div style={listStyle}>
          <div style={{marginLeft: 150}}>
            <Ghost className='floating' size={100} mood="happy" color="#FDA7DC" />
          </div>
          <p style={{margin: 20, color: 'grey', textAlign: 'center'}}>{"Sometimes our transcriptions take time. Hit refresh transcription to see if it's ready!"}</p>
        </div>
      );
    }
  }

  renderBottomView() {
    if (this.state.stage == STAGE_TRANSCRIBING) {
      return (
        <div>
          <Row style={{height: 550}}>
            {this.renderLeftPanel()}
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
          {this.renderRefreshTranscription()}
          <div style={buttonRoot}>
            <button className='button-rounded' onClick={() => this.saveCaptions()} style={{cursor: 'pointer'}}>
              {"Publish"}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={{margin: 50}}>
            <LinearProgress variant="determinate" value={this.state.progress} />
          </div>
          <div style={animationRoot}>
            <Ghost className='floating' size={200} mood="shocked" color="#FCCB7E" />
          </div>
          <p style={{color: 'grey', textAlign: 'center'}}>{"Publishing your clip!"}</p>
        </div>
      );
    }
  }

  renderRefreshTranscription() {
    if (!this.state.hasTranscription) {
      return(
        <button className='button-rounded-gold' style={{cursor: 'pointer'}} onClick={() => this.parseTranscription(this.state.id)}>
          {"Refresh Transcription"}
        </button>
      );
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

export default TranscriptionEditor;
