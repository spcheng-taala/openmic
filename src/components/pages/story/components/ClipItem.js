// ClipItem.js
import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Row } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const textStyleBig = {
  color: 'white',
  fontFamily: "Lato",
  flex: 1,
  fontSize: 30,
  marginLeft: 20,
}

const textStyleSmall = {
  color: 'white',
  fontFamily: "Lato",
  fontSize: 20,
  marginLeft: 90,
}

const durationStyle = {
  color: 'white',
  fontFamily: 'Lato',
  fontSize: 16,
  float: 'right',
  marginRight: 30,
}

class ClipItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };

    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.playPause = this.playPause.bind(this);
    this.createMinString = this.createMinString.bind(this);
  }

  renderPlayPause() {
    if (this.props.currentClip == this.props.index) {
      return (
        <img style={{width: 50, height: 50}} src='../../../../../../images/pause_simple.png'/>
      )
    } else {
      return (
        <img style={{width: 50, height: 50}} src='../../../../../../images/play_simple.png'/>
      )
    }
  }

  playPause() {
    this.props.playClip(this.props.index);
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

  render() {
    return (
      <div>
        <CardActionArea onClick={() => this.playPause()}>
          <Paper elevation={1} style={{backgroundColor:'#5C70D8'}}>
            <div>
              <Row style={{marginLeft: 20, marginTop: 20, paddingTop: 20}}>
                {this.renderPlayPause()}
                <Typography style={textStyleBig}>
                  {this.props.title}
                </Typography>
                <Typography style={durationStyle}>
                  {this.createMinString(this.props.duration)}
                </Typography>
              </Row>
              <Typography style={textStyleSmall}>
                {"Clipped by " + this.props.name}
              </Typography>
              <div id={"waveform-clip" + this.props.id} style={{ marginLeft: 50, marginRight: 50 }}></div>
              <Row style={{float: 'right', marginRight: 30}}>
                <img style={{width: 50, height: 50}} src='../../../../../../images/share_white.png'/>
                <img style={{width: 50, height: 50}} src='../../../../../../images/heart.png'/>
              </Row>
            </div>
          </Paper>
        </CardActionArea>
      </div>
    );
  }
}

export default ClipItem;
