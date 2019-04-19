// ClipItem.js
import React from 'react';
import VideoThumbnail from 'react-video-thumbnail';
import { Row, Col } from 'react-grid-system';
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
  marginLeft: 20,
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

    this.playPause = this.playPause.bind(this);
    this.createMinString = this.createMinString.bind(this);
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
              <Row style={{marginLeft: 20, marginTop: 20, paddingTop: 20, paddingBottom: 20}}>
                <div style={{width: 120, height: 80}}>
                  <VideoThumbnail
                    videoUrl={this.props.url}
                    thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                    width={120}
                    height={80} />
                </div>
                <Col>
                  <Typography style={textStyleBig}>
                    {this.props.title}
                  </Typography>
                  <Typography style={textStyleSmall}>
                    {"Clipped by " + this.props.name}
                  </Typography>
                </Col>
                <div style={{float: 'right'}}>
                  <Typography style={durationStyle}>
                    {this.createMinString(this.props.duration)}
                  </Typography>                  
                </div>
              </Row>
            </div>
          </Paper>
        </CardActionArea>
      </div>
    );
  }
}

export default ClipItem;
