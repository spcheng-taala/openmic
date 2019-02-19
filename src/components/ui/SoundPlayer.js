import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlayButton, PrevButton, NextButton, Progress, Timer, VolumeControl } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';

class SoundPlayer extends Component {
  render() {
    const { trackTitle } = this.props;

    return (
      <div className="p1 mt1 flex flex-center bg-darken-1 orange rounded">
        <PlayButton
          playing={this.props.playing}
          className="flex-none h4 button button-transparent button-grow rounded mr2"
          {...this.props} />
        <div className="flex-auto m0">
          <h2 className="h3 text nowrap">{this.props.streamUrl}</h2>
          <h2 className="h5 text">{this.props.streamUrl}</h2>
        </div>
        <Timer className="h6 text nowrap caps mt3 mr1" {...this.props} />
      </div>
    );
  }
}

SoundPlayer.propTypes = {
  preloadType: PropTypes.string,
  playing: PropTypes.boolean,
  streamUrl: PropTypes.string.isRequired,
  trackTitle: PropTypes.string.isRequired
};

SoundPlayer.defaultProps = {
  preloadType: 'auto'
};

export default withCustomAudio(SoundPlayer);
