// ClipItem.js
import React from 'react';
import { Row, Col } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UtilsManager from '../../../singletons/UtilsManager.js';

const centerVertical = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 25,
  height: 25,
  padding: 0,
}

const textStyleBig = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 20,
  marginRight: 10,
  paddingTop: 10,
}

const textStyleMed = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 17,
  marginLeft: 20,
  marginRight: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const likeCountStyle = {
  color: '#D14C85',
  fontFamily: 'Lato',
  fontSize: 17,
  marginLeft: 20,
  marginRight: 5,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const textStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 15,
  marginLeft: 20,
  marginBottom: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

const likeCountStyleMobile = {
  color: '#D14C85',
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
    var thumbnailWidth = 150;
    var thumbnailHeight= 150;
    if (this.props.isMobile) {
      thumbnailWidth = 100;
      thumbnailHeight= 100;
    }
    if (this.props.thumbnail) {
      return (
        <img alt={"thumbnail"} style={{width: thumbnailWidth, height: thumbnailHeight, overflow: 'hidden', objectFit: 'cover'}} src={this.props.thumbnail}/>
      );
    } else {
      return (
        <img style={{width: thumbnailWidth, height: thumbnailHeight, overflow: 'hidden'}} src='../../../../../../images/default_clip_picture_1.png' alt={'Clip'}/>
      )
    }
  }

  render() {
    var textBig = textStyleBig;
    var textMed = textStyleMed;
    var textLikeCountStyle = likeCountStyle
    var textSmall = textStyleSmall;
    if (this.props.isMobile) {
      textBig = textStyleBigMobile;
      textMed = textStyleMedMobile;
      textLikeCountStyle = likeCountStyleMobile
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
                    {this.renderThumbnail()}
                  </div>
                </div>
                <Col>
                  <Typography className="lineClamp" style={textBig}>
                    {this.props.title}
                  </Typography>
                  <Typography className="lineClamp" style={textMed}>
                    {"From: " + this.props.podcast}
                  </Typography>
                  <Row style={{marginLeft: 0, marginRight: 5}}>
                    <Typography className="lineClamp" style={textLikeCountStyle}>
                      {UtilsManager.createNumberString(this.props.likeCount)}
                    </Typography>
                    <Col style={{padding: 0}}>
                      <img src='../../../../../../images/heart_filled.png' alt={'heart'} style={centerVertical} />
                    </Col>
                  </Row>
                  <Typography className="lineClamp" style={textSmall}>
                    {"Clipped by " + this.props.name}
                  </Typography>
                  <Typography className="lineClamp" style={textSmall}>
                    {UtilsManager.createMinString(this.props.duration)}
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
