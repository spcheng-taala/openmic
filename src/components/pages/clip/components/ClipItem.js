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
  fontSize: 16,
  marginRight: 10,
  paddingTop: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const textStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 13,
  marginRight: 10,
  marginBottom: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const thumbnail = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  marginTop: 20,
}

class ClipItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
  }

  render() {
    return (
      <div>
        <CardActionArea onClick={() => this.props.handleClipClick(this.props.id)}>
          <div>
            <Row>
              <div>
                <div style={{paddingBottom: 10, paddingTop: 10}}>
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
