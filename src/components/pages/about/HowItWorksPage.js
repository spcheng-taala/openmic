import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Header from '../../ui/Header.js';
import MidTitle from '../../ui/MidTitle.js';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import ReactPlayer from 'react-player';

 const text = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 20,
   textAlign: 'center',
   marginBottom: 10,
 }

 const titleText = {
   color: '#4E5CD8',
   fontFamily: 'Lato',
   fontSize: 30,
   fontWeight: 'bold',
   marginBottom: 10,
 }

 const descText = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 17,
   marginTop: 10,
 }

 const sectionTitleText = {
   color: '#4E5CD8',
   fontFamily: 'Lato',
   fontSize: 20,
 }

 const sectionText = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 17,
   margin: 10,
 }

 const gridList = {
   width: 500,
   height: 450,
 }

 const root = {
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   overflow: 'hidden',
   marginTop: 20,
 }

 const icon = {
   color: 'rgba(255, 255, 255, 0.54)'
 }

class HowItWorksPage extends Component {

  componentDidMount() {
    this.props.hideDrawer(true);
  }

  componentWillUnmount() {
    this.props.hideDrawer(false);
  }

  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
    this.state = {
      isFinished: false,
      isPlaying: false,
      url: 'https://s3-us-west-2.amazonaws.com/openmic-files/74_1558418164705_captioned.mp4',
    };

    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.replay = this.replay.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
  }

  togglePlayPause() {
    var isPlaying = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlaying,
    });
  }

  replay() {
    this.setState({
      isFinished: false,
      isPlaying: true,
    });
    this.playAtValue(0);
  }

  handleVideoProgress(state) {
    var seconds = state.played * this.player.getDuration();

    if (seconds >= this.player.getDuration()) {
      this.setState({
        isPlaying: false,
        isFinished: true,
      });
    }
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

  ref = player => {
    this.player = player
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        <div className="landing-page">
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Don't just listen, create!"}</h1>
            <p style={text}>{"Add your own personal flair to your favorite podcasts. Clipping allows you to create short video clips from your favorite podcast highlights by allowing you to cut an audio segment and adding your favorite GIF's. In addition we automatically transcribe your videos so they will even work on mute! This will not only make sharing your favorite podcasts easier, but it may catch the eye of the original podcaster!"}</p>
          </Container>
          <Container>
            <div style={{backgroundColor: '#0F0D12', marginTop: 50}}>
              <div style={root}>
                <ReactPlayer
                  ref={this.ref}
                  style={{marginTop: 20}}
                  url={this.state.url}
                  onProgress={this.handleVideoProgress}
                  playing={this.state.isPlaying} />
              </div>
              <div style={{marginTop: 20, marginRight: 25}}>
                {this.renderPlayPause()}
              </div>
            </div>
          </Container>
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"How it works"}</h1>
            <Row>
              <Col lg={4}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/clapper_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Clip the audio"}</p>
                  </Row>
                  <p style={sectionText}>{"Cut the audio of your favorite portion of the podcast!"}</p>
                </div>
              </Col>
              <Col lg={4}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/gif_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"GIF it up"}</p>
                  </Row>
                  <p style={sectionText}>{"Add your favorite GIF's on top of the audio to create a short video!"}</p>
                </div>
              </Col>
              <Col lg={4}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/share_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Share"}</p>
                  </Row>
                  <p style={sectionText}>{"Share your work of art so fans and friends can see it!"}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default HowItWorksPage;
