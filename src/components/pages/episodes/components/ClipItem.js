// ClipItem.js
import React from 'react';
import VideoThumbnail from '../../../sections/VideoThumbnail.js';
import { Row, Col } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UtilsManager from '../../../singletons/UtilsManager.js';

const textStyleBig = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 20,
  marginRight: 10,
  paddingTop: 10,
}

const textStyleSmall = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 14,
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 10,
}

const textStyleDuration = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 14,
  marginLeft: 20,
  marginRight: 20,
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

const textStyleSmallMobile = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 12,
  marginLeft: 20,
  marginBottom: 10,
}

const textStyleDurationMobile = {
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

    this.renderThumbnail = this.renderThumbnail.bind(this);
    this.setThumbnail = this.setThumbnail.bind(this);
    this.getDescription = this.getDescription.bind(this);
  }

  setThumbnail(thumbnail) {
    if (thumbnail) {
      this.setState({
        thumbnail: thumbnail
      });
    }
  }

  renderThumbnail() {
    if (this.props.thumbnail) {
      return (
        <img style={{width: 100, height: 100, overflow: 'hidden'}} src={this.props.thumbnail}/>
      );
    } else {
      return (
        <img style={{width: 100, height: 100, overflow: 'hidden'}} src='../../../../../../images/default_clip_picture_1.png' alt={'Clip'}/>
      )
    }
  }

  getDescription(description) {
    const regex = /(<([^>]+)>)/ig;
    return description.replace(regex, '');
  }

  render() {
    var textBig = textStyleBig;
    var textSmall = textStyleSmall;
    var textDuration = textStyleDuration
    if (this.props.isMobile) {
      textBig = textStyleBigMobile;
      textSmall = textStyleSmallMobile;
      textDuration = textStyleDurationMobile
    }
    return (
      <div>
        <CardActionArea>
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
                  <Typography className="block-with-text" style={textSmall}>
                    {this.getDescription(this.props.description)}
                  </Typography>
                  <Typography style={textDuration}>
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
