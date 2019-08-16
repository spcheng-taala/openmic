// SponsorItem.js
import React from 'react';
import VideoThumbnail from '../../../sections/VideoThumbnail.js';
import { Row, Col } from 'react-grid-system';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const textStyleBig = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 24,
  fontWeight: 'bold',
  marginLeft: 20,
  paddingTop: 10,
  marginRight: 20,
}

const textStyleMed = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 15,
  marginLeft: 20,
  marginRight: 20,
}

const textStyleCode = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 17,
  fontStyle: 'italic',
  marginTop: 10,
  marginLeft: 20,
  marginRight: 20,
}

const textStyleDesc = {
  color: '#5E5861',
  fontFamily: 'Lato',
  fontSize: 15,
  marginLeft: 20,
  marginRight: 20,
}

const textStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 15,
  fontStyle: 'italic',
  marginLeft: 20,
  marginTop: 20,
  marginBottom: 5,
  marginRight: 20,
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

class SponsorItem extends React.Component {

  constructor(props) {
    super(props);

    this.renderText = this.renderText.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  renderText() {
    return (
      <div>
        <Typography className="lineClamp" style={textStyleBig}>
          {this.props.sponsor.name}
        </Typography>
        <Typography className="lineClamp" style={textStyleDesc}>
          {this.props.sponsor.desc_text}
        </Typography>
        <Typography className="lineClamp" style={textStyleBig}>
          {this.props.sponsor.number_text}
        </Typography>
        <Typography className="lineClamp" style={textStyleMed}>
          {this.props.sponsor.number_desc_text}
        </Typography>
        {this.props.sponsor.code ? <Typography className="lineClamp" style={textStyleCode}>
          {"Code: " + this.props.sponsor.code}
        </Typography> : <div/>}
        <Typography className="lineClamp" style={textStyleSmall}>
          {"From " + this.props.sponsor.title}
        </Typography>
      </div>
    );
  }

  renderImage() {
    if (this.props.isMobile) {
      return (
        <img style={{width: '100%'}} src={this.props.sponsor.image_url}/>
      );
    } else {
      return (
        <img style={{width: '50%', display: 'inline-block'}} src={this.props.sponsor.image_url}/>
      );
    }
  }

  render() {
    if (this.props.isMobile) {
      return (
        <div style={{height: '60%', cursor: 'pointer', backgroundColor: 'white'}} onClick={() => this.props.handleSponsorClick(this.props.sponsor)}>
          {this.renderImage()}
          {this.renderText()}
        </div>
      )
    } else {
      if (this.props.index % 2) {
        return (
          <div style={{height: '60%', cursor: 'pointer', backgroundColor: 'white'}} onClick={() => this.props.handleSponsorClick(this.props.sponsor)}>
            {this.renderImage()}
            <div style={{width: '50%', display: 'inline-block'}}>
              {this.renderText()}
            </div>
          </div>
        );
      } else {
        return (
          <div style={{height: '60%', cursor: 'pointer', backgroundColor: 'white'}} onClick={() => this.props.handleSponsorClick(this.props.sponsor)}>
            <div style={{width: '50%', display: 'inline-block'}}>
              {this.renderText()}
            </div>
            {this.renderImage()}
          </div>
        );
      }
    }
  }
}

export default SponsorItem;
