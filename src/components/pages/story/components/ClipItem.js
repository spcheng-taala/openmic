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
  fontWeight: 'bold',
  fontSize: 16,
  marginLeft: 20,
  paddingTop: 10,
}

const textStyleMed = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 15,
  marginLeft: 20,
}

const textStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 13,
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

class ClipItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      thumbnail: "",
    };

    this.renderThumbnail = this.renderThumbnail.bind(this);
    this.setThumbnail = this.setThumbnail.bind(this);
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
        <img style={{width: 100}} src={this.props.thumbnail}/>
      );
    } else {
      return (
        <img style={{width: 100}} src='../../../../../../images/default_clip_picture_1.png' alt={'Clip'}/>
      )
    }
  }

  render() {
    return (
      <div>
        <CardActionArea onClick={() => this.props.handleClipClick(this.props.id)}>
          <div>
            <Row>
              <div>
                <div style={{marginLeft: 25, paddingBottom: 10, paddingTop: 10}}>
                  {this.renderThumbnail()}
                </div>
              </div>
              <Col>
                <Typography className="lineClamp" style={textStyleBig}>
                  {this.props.title}
                </Typography>
                <Typography className="lineClamp" style={textStyleSmall}>
                  {"clipped by " + this.props.name}
                </Typography>
              </Col>
            </Row>
          </div>
        </CardActionArea>
      </div>
    );
  }
}

export default ClipItem;
