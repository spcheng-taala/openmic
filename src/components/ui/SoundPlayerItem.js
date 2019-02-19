import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-grid-system';
import { PlayButton, PrevButton, NextButton, Progress, Timer, VolumeControl } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

var cardStyle = {
  marginBottom: 30,
}

var containerStyle = {
  marginLeft: 20,
  marginTop: 20,
  marginBottom: 300,
}

const bigAvatar = {
  width: 80,
  height: 80,
}

const mediaStyle = {
  width: '100%',
  paddingTop: 50,
  paddingBottom: 50,
  backgroundColor: '#FFFFFF'
}

const mediaTextStyle = {
  paddingLeft: 60,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 30,
}

const mediaTextStyleSmall = {
  paddingLeft: 60,
  align: 'center',
  color: 'grey',
  fontFamily: "Lato",
  fontSize: 20,
}

class SoundPlayerItem extends Component {

  constructor(props) {
    super(props);

    this.playTrack = this.playTrack.bind(this);
  }

  playTrack(streamUrl) {
    const { soundCloudAudio } = this.props;

    soundCloudAudio.play({ streamUrl });
  }

  render() {
    return (
        <div>
          <Paper style={mediaStyle} elevation={1}>
            <div>
              <Container onClick={() => this.playTrack(this.props.url)}>
                <Row>
                  <PlayButton
                    onClick={() => this.props.handlePlayClick(this.props.story)}
                    className="flex-none h3 button button-grow rounded mr2"
                    {...this.props} />
                  <Avatar alt={this.props.story.user.first_name + " " + this.props.story.user.last_name}
                    src={this.props.story.user.profile_picture} style={bigAvatar} />
                    <div>
                      <Typography style={mediaTextStyle}>
                        {this.props.story.title}
                      </Typography>
                      <Typography style={mediaTextStyleSmall}>
                        {this.props.story.user.first_name + " " + this.props.story.user.last_name}
                      </Typography>
                    </div>
                </Row>
              </Container>
            </div>
          </Paper>
      </div>
    );
  }
}

SoundPlayerItem.propTypes = {
  preloadType: PropTypes.string,
  streamUrl: PropTypes.string.isRequired,
  story: PropTypes.object.isRequired,
};

SoundPlayerItem.defaultProps = {
  preloadType: 'auto'
};

export default withCustomAudio(SoundPlayerItem);
