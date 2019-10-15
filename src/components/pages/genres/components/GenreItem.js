// ClipItem.js
import React from 'react';
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

const textStyleMed = {
  color: '#2A2D34',
  fontFamily: 'Lato',
  fontSize: 17,
  marginLeft: 20,
  marginRight: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingBottom: 10,
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
  paddingBottom: 10,
}

class GenreItem extends React.Component {

  render() {
    var clipsText = this.props.genre.count + " clips";
    if (this.props.genre.count == 1) {
      clipsText = this.props.genre.count + " clip";
    }
    var textBig = textStyleBig;
    var textMed = textStyleMed;
    if (this.props.isMobile) {
      textBig = textStyleBigMobile;
      textMed = textStyleMedMobile;
    }
    return (
      <div>
        <CardActionArea onClick={() => this.props.handleGenreClick(this.props.genre)}>
          <Paper elevation={1}>
            <div>
              <Typography className="lineClamp" style={textBig}>
                {this.props.genre.name}
              </Typography>
              <Typography className="lineClamp" style={textMed}>
                {clipsText}
              </Typography>
            </div>
          </Paper>
        </CardActionArea>
      </div>
    );
  }
}

export default GenreItem;
