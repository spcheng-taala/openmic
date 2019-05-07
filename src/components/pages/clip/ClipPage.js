import React, { Component } from 'react';
import './assets/index.scss';
import "react-input-range/lib/css/index.css";
import InputRange from 'react-input-range';
import ReactTooltip from 'react-tooltip';
import TwitterLogin from './components/TwitterLogin.js';
import ReactPlayer from 'react-player';
import { Container, Row, Col } from 'react-grid-system';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
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

const timeTextFiledFontStyle = {
  font: 'Lato',
  fontSize: 14,
}

const textStyleBig = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 30,
  marginLeft: 25,
  marginRight: 50,
}

const textStyleSmall = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 20,
  marginLeft: 25,
  marginRight: 50,
  marginBottom: 20,
}

const textStyleTiny = {
  color: '#2D2D31',
  fontFamily: "Lato",
  textAlign: 'left',
  fontSize: 14,
  marginLeft: 25,
  marginRight: 50,
  marginBottom: 20,
}

class ClipPage extends Component {

  componentDidMount() {
    BackendManager.makeQuery('clips', JSON.stringify({
      clip_id: this.props.match.params.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          clip: data.clip,
        });
      }
    });
  }

  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
    this.state = {
      clip: null,
      isPlaying: true,
      value: 0,
      duration: 0,
      scrubberShouldMove: true,
      isFinished: false,
    };

    this.createMinString = this.createMinString.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleScrubberMove = this.handleScrubberMove.bind(this);
    this.playAtValue = this.playAtValue.bind(this);
    this.renderView = this.renderView.bind(this);
    this.onTwitterAuthSuccess = this.onTwitterAuthSuccess.bind(this);
    this.onTwitterAuthFailure = this.onTwitterAuthFailure.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.replay = this.replay.bind(this);
    this.renderMainScreen = this.renderMainScreen.bind(this);
  }

  replay() {
    this.setState({
      isFinished: false,
      isPlaying: true,
    });
    this.playAtValue(0);
  }

  togglePlayPause() {
    var isPlaying = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlaying,
    });
  }

  renderPlayPause() {
    if (this.state.isFinished) {
      return (
        <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 20}} onClick={() => this.replay()}>
          <img
            style={{marginLeft: 20, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
            src='../../../../../images/replay.png'
            />
        </div>
      );
    } else {
      if (this.state.isPlaying) {
        return (
          <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 20}} onClick={() => this.togglePlayPause()}>
            <img
              style={{marginLeft: 20, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
              src='../../../../../images/pause_simple.png'
              />
          </div>
        );
      } else {
        return (
          <div style={{width: 50, height: 50, cursor: 'pointer', marginLeft: 10, zIndex: 10}} onClick={() => this.togglePlayPause()}>
            <img
              style={{marginLeft: 20, width: 30, height: 30, cursor: 'pointer', top: '50%'}}
              src='../../../../../images/play_simple.png'
              />
          </div>
        );
      }
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

  handleVideoProgress(state) {
    var seconds = state.played * this.player.getDuration();
    if (this.state.scrubberShouldMove) {
      this.setState({
        value: seconds,
      });
    }

    if (seconds == this.state.duration) {
      this.setState({
        isPlaying: false,
        isFinished: true,
        value: 0,
      });
    }
  }

  ref = player => {
    this.player = player
  }

  handleDurationChange(duration) {
    this.setState({
      duration: duration,
    });
  }

  handleScrubberMove(value) {
    this.setState({
      scrubberShouldMove: false,
      value: value,
      isPlaying: false,
    });
  }

  playAtValue(value) {
    this.setState({
      scrubberShouldMove: true,
      isPlaying: true,
    });
    this.player.seekTo(parseFloat(value));
  }

  renderMainScreen() {
    if (this.state.isFinished) {
      <div style={{background: 'rgba(45, 45, 49, 0.8)'}}>
        <Row>
          <img
            style={{width: 70, cursor: 'pointer', top: '50%'}}
            src='../../../../../images/share_circle.png'
            />
          <img
            style={{width: 70, cursor: 'pointer', top: '50%'}}
            src='../../../../../images/replay_circle.png'
            />
        </Row>
      </div>
    } else {
      return (
        <ReactPlayer
          ref={this.ref}
          style={{marginTop: 20}}
          url={this.state.clip.url}
          onProgress={this.handleVideoProgress}
          onDuration={this.handleDurationChange}
          playing={this.state.isPlaying} />
      );
    }
  }

  renderView() {
    if (this.state.clip != null) {
      return (
        <div style={{margin: 20}}>
          <Card>
            <div style={{backgroundColor: '#0F0D12', paddingBottom: 20}}>
              <div style={root}>
                <ReactPlayer
                  ref={this.ref}
                  style={{marginTop: 20}}
                  url={this.state.clip.url}
                  onProgress={this.handleVideoProgress}
                  onDuration={this.handleDurationChange}
                  playing={this.state.isPlaying} />
              </div>
              <div style={{marginTop: 30, marginRight: 25, marginLeft: 25}}>
                <InputRange
                  draggableTrack
                  maxValue={this.state.duration}
                  minValue={0}
                  formatLabel={value => this.createMinString(value)}
                  onChange={value => this.handleScrubberMove(value)}
                  onChangeComplete={value => this.playAtValue(value)}
                  value={this.state.value} />
                {this.renderPlayPause()}
              </div>
            </div>
            <Row>
              <Col>
                <Typography style={textStyleBig}>
                  {this.state.clip.title}
                </Typography>
                <Typography style={textStyleSmall}>
                  {"Clipped by " + this.state.clip.first_name}
                </Typography>
              </Col>
              <button className='button-rounded' style={{ marginTop: 20, marginRight: 30 }} data-tip data-for='share_clip' data-event='click'>Share</button>
              <ReactTooltip id='share_clip' place='top' effect='solid' clickable={true}>
                <Row style={{marginLeft: 20}}>
                  <TwitterLogin
                    style={{width: 30, height: 30, backgroundColor: '#1DA1F2', cursor: 'pointer', padding: 0}}
                    loginUrl="https://api.mypokadot.com/pp/auth/twitter"
                    onFailure={this.onTwitterAuthFailure}
                    onSuccess={this.onTwitterAuthSuccess}
                    forceLogin={true}
                    requestTokenUrl="https://api.mypokadot.com/pp/auth/twitter/reverse"
                  >
                    <img data-tip data-for='twitterTT' style={{width: 20, height: 20}} src='../../../../../images/twitter_icon.png'/>
                  </TwitterLogin>
                  <ReactTooltip id="twitterTT" place="top" type="light" effect="float">
                    <span>Twitter</span>
                  </ReactTooltip>
                  <div data-tip data-for='clipboardTT' style={{marginLeft: 10, backgroundColor: '#3ABBBC', width: 30, height: 30, cursor: 'pointer'}} onClick={() => this.copyToClipboard()}>
                    <img style={{width: 30, height: 30}} src='../../../../../images/copy.png'/>
                  </div>
                  <ReactTooltip id="clipboardTT" place="top" type="light" effect="float">
                    <span>Copy to clipboard</span>
                  </ReactTooltip>
                </Row>
                {
                  document.queryCommandSupported('copy') &&
                  <input ref={this.copyRef} type='text' value={'https://theopenmic.fm/clips/' + this.state.clip.id} style={{width: 100, marginTop: 10}} />
                }
              </ReactTooltip>
            </Row>
          </Card>
          <Card className='floating' style={{marginTop: 20, paddingTop: 20, paddingBottom: 20}}>
            <CardActionArea onClick={() => this.props.history.push('/story/' + this.state.clip.story_id)}>
              <Row>
                <Avatar src={this.state.clip.profile_picture} style={{width: 50, height: 50, marginTop: 10, marginLeft: 40, display: 'inline-block'}} />
                <Col>
                  <Typography style={textStyleBig}>
                    {"Listen to the full story: " + this.state.clip.story_title}
                  </Typography>
                  <Typography style={textStyleSmall}>
                    {this.state.clip.creator_first_name + " " + this.state.clip.creator_last_name}
                  </Typography>
                </Col>
              </Row>
            </CardActionArea>
          </Card>
        </div>
      );
    }
  }

  copyToClipboard() {
    this.copyRef.current.select();
    document.execCommand('copy');
    this.props.showToast('Copied!');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    // e.target.focus();
    // setCopySuccess('Copied!');
  }

  onTwitterAuthFailure(error) {
    alert(error);
  }

  onTwitterAuthSuccess(response) {
    response.json().then(body => {
      localStorage.setItem('oauth_token', body.data.oauth_token);
      localStorage.setItem('oauth_token_secret', body.data.oauth_token_secret);
      localStorage.setItem('screen_name', body.data.screen_name);
      if (this.state.clip != null) {
        localStorage.setItem('clip_url', this.state.clip.url);
        localStorage.setItem('clip_title', this.state.clip.title);
        localStorage.setItem('clip_id', this.state.clip.id);
      }
      window.open('/share/t');
    });
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        {this.renderView()}
      </div>
    )
  }
}

export default ClipPage;
