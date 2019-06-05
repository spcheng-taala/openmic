// ClipItem.js
import React from 'react';
import VideoThumbnail from 'react-video-thumbnail';
import { Row, Col } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const row = {
  width: '100%',
}

const block = {
  display: 'inline-block',
}

const textStyleBig = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 30,
  marginLeft: 20,
  paddingTop: 10,
}

const textStyleMed = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 20,
  marginLeft: 20,
}

const textStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 16,
  marginLeft: 20,
  marginBottom: 10,
}

const durationStyle = {
  color: 'white',
  fontFamily: 'Lato',
  fontSize: 16,
  float: 'right',
  marginRight: 30,
}

const thumbnail = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  marginTop: 20,
  marginLeft: 50,
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
        <CardActionArea onClick={() => this.props.handleClipClick(this.props.id)}>
          <Paper elevation={1}>
            <div>
              <Row>
                <div>
                  <div style={{marginLeft: 25, paddingBottom: 10, paddingTop: 10}}>
                    <div style={{height: 150, width: 200}}>
                      <VideoThumbnail
                        style={thumbnail}
                        videoUrl={this.props.url}
                        width={200}
                        height={150}
                        thumbnailHandler={(thumbnail) => console.log(thumbnail)}/>
                    </div>
                  </div>
                </div>
                <Col>
                  <Typography className="lineClamp" style={textStyleBig}>
                    {this.props.title}
                  </Typography>
                  <Typography className="lineClamp" style={textStyleMed}>
                    {"from: " + this.props.podcast}
                  </Typography>
                  <Typography className="lineClamp" style={textStyleSmall}>
                    {"clipped by " + this.props.name}
                  </Typography>
                </Col>
              </Row>
            </div>
          </Paper>
        </CardActionArea>
      </div>
    );
  }
}

export default ClipItem;
