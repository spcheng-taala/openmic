// ClipItem.js
import React from 'react';
import VideoThumbnail from '../../../sections/VideoThumbnail.js';
import { Row, Col } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const textStyleBig = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 20,
  paddingTop: 10,
}

const textStyleMed = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 17,
  marginLeft: 20,
}

const textStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 15,
  marginLeft: 20,
  marginBottom: 5,
}

const textStyleSmallRed = {
  color: '#FF0081',
  fontFamily: 'Lato',
  fontSize: 16,
  fontWeight: 'bold',
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
      thumbnail: "",
    };

    this.playPause = this.playPause.bind(this);
    this.renderThumbnail = this.renderThumbnail.bind(this);
    this.setThumbnail = this.setThumbnail.bind(this);
  }

  playPause() {
    this.props.playClip(this.props.index);
  }

  setThumbnail(thumbnail) {
    if (thumbnail) {
      this.setState({
        thumbnail: thumbnail
      });
    }
  }

  renderThumbnail() {
    var thumbnailWidth = 200;
    var thumbnailHeight= 150;
    if (this.props.isMobile) {
      thumbnailWidth = 100;
      thumbnailHeight= 75;
    }
    if (this.props.thumbnail) {
      return (
        <img style={{width: thumbnailWidth, height: thumbnailHeight}} src={this.props.thumbnail}/>
      );
    } else {
      return (
        <img style={{width: thumbnailWidth, height: thumbnailHeight}} src='../../../../../../images/default_clip_picture_1.png' alt={'Clip'}/>
      )
    }
  }

  render() {    
    var thumbnailWidth = 200;
    var thumbnailHeight= 113;
    var textBig = textStyleBig;
    var textMed = textStyleMed;
    var textSmall = textStyleSmall;
    if (this.props.isMobile) {
      thumbnailWidth = 100;
      thumbnailHeight= 56.5;
      textBig = textStyleBigMobile;
      textMed = textStyleMedMobile;
      textSmall = textStyleSmallMobile;
    }
    return (
      <div>
        <CardActionArea onClick={() => this.props.handleClick(this.props.id)}>
          <Paper elevation={1}>
            <div>
              <Row>
                <div>
                  <div style={{marginLeft: 25, paddingBottom: 10, paddingTop: 10}}>
                    {this.renderThumbnail()}
                  </div>
                </div>
                <Col>
                  <Typography className="lineClamp" style={textBig}>
                    {this.props.title}
                  </Typography>
                  <Typography className="lineClamp" style={textStyleSmall}>
                    {"clipped from " + this.props.podcast}
                  </Typography>
                  <Typography className="lineClamp" style={textStyleSmall}>
                    {"clipped by " + this.props.name}
                  </Typography>
                  {this.props.active == 0 ? <Typography className="lineClamp" style={textStyleSmallRed}>
                    {"Not published yet. Click here to finish up."}
                  </Typography> : <div/>}
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
