// ClipItem.js
import React from 'react';
import VideoThumbnail from 'react-video-thumbnail';
import { Row, Col } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

const thumbnail = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  marginTop: 20,
  marginLeft: 50,
}

const textStyleBigMobile = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 20,
  marginLeft: 20,
  paddingTop: 10,
}

const textStyleMedMobile = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 14,
  marginLeft: 20,
}

const textStyleSmallMobile = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 12,
  marginLeft: 20,
  marginBottom: 10,
}

class ClipItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };

    this.playPause = this.playPause.bind(this);
  }

  playPause() {
    this.props.playClip(this.props.index);
  }

  render() {
    var thumbnailWidth = 200;
    var thumbnailHeight= 150;
    var textBig = textStyleBig;
    var textMed = textStyleMed;
    var textSmall = textStyleSmall;
    if (this.props.isMobile) {
      thumbnailWidth = 100;
      thumbnailHeight= 75;
      textBig = textStyleBigMobile;
      textMed = textStyleMedMobile;
      textSmall = textStyleSmallMobile;
    }
    return (
      <div>
        <CardActionArea onClick={() => this.props.handleClipClick(this.props.id)}>
          <Paper elevation={1}>
            <div>
              <Row>
                <div>
                  <div style={{marginLeft: 25, paddingBottom: 10, paddingTop: 10}}>
                    <div style={{height: thumbnailHeight, width: thumbnailWidth}}>
                      <VideoThumbnail
                        style={thumbnail}
                        videoUrl={this.props.url}
                        width={thumbnailWidth}
                        height={thumbnailHeight}
                        thumbnailHandler={(thumbnail) => console.log(thumbnail)}/>
                    </div>
                  </div>
                </div>
                <Col>
                  <Typography className="lineClamp" style={textBig}>
                    {this.props.title}
                  </Typography>
                  <Typography className="lineClamp" style={textMed}>
                    {"from: " + this.props.podcast}
                  </Typography>
                  <Typography className="lineClamp" style={textSmall}>
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
