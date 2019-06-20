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
  fontSize: 17,
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
  fontSize: 14,
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

  render() {
    return (
      <div>
        <CardActionArea onClick={() => this.props.handleClipClick(this.props.id)}>
          <div>
            <Row>
              <div>
                <div style={{marginLeft: 25, paddingBottom: 10, paddingTop: 10}}>
                  <div style={{height: 75, width: 100}}>
                    <VideoThumbnail
                      style={thumbnail}
                      videoUrl={this.props.url}
                      width={100}
                      height={75}
                      thumbnailHandler={(thumbnail) => console.log(thumbnail)}/>
                  </div>
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
