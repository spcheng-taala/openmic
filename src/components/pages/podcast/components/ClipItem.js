// ClipItem.js
import React from 'react';
import { Row, Col } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import UtilsManager from '../../../singletons/UtilsManager.js';

const centerVertical = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 15,
  height: 15,
  padding: 0,
}

const textStyleBig = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 16,
  marginRight: 10,
  paddingTop: 10,
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const textStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 13,
  marginRight: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const likeCountStyleSmall = {
  color: '#FF0081',
  fontFamily: 'Lato',
  fontSize: 13,
  marginRight: 5,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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
        <img alt={"thumbnail"} style={{width: 75, height: 75, objectFit: 'cover'}} src={this.props.thumbnail}/>
      );
    } else {
      return (
        <img style={{width: 75}} src='../../../../../../images/default_clip_picture_1.png' alt={'Clip'}/>
      )
    }
  }

  render() {
    return (
      <div style={{paddingTop: 10, paddingBottom: 10}}>
        <CardActionArea onClick={() => this.props.handleClipClick(this.props.id)}>
          <div>
            <Row>
              <div>
                <div style={{paddingBottom: 10, paddingTop: 10}}>
                  <div style={{marginLeft: 25, paddingBottom: 10, paddingTop: 10}}>
                    {this.renderThumbnail()}
                  </div>
                </div>
              </div>
              <Col>
                <Typography className="lineClamp" style={textStyleBig}>
                  {this.props.title}
                </Typography>
                <Typography className="lineClamp" style={textStyleSmall}>
                  {"Clipped by " + this.props.name}
                </Typography>
                <Typography className="lineClamp" style={textStyleSmall}>
                  {UtilsManager.createMinString(this.props.duration)}
                </Typography>
                <Row style={{marginLeft: 0, marginRight: 5}}>
                  <Typography className="lineClamp" style={likeCountStyleSmall}>
                    {UtilsManager.createNumberString(this.props.likeCount)}
                  </Typography>
                  <Col style={{padding: 0}}>
                    <img src='../../../../../../images/heart_filled.png' alt={'heart'} style={centerVertical} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </CardActionArea>
      </div>
    );
  }
}

export default ClipItem;
