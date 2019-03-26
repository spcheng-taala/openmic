import Ciseaux from 'ciseaux/browser';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';

class ClipAudioPage extends Component {

  constructor(props) {
    super(props);
    this.createAudioClip = this.createAudioClip.bind(this);
  }

  createAudioClip() {
    Ciseaux.context = new AudioContext();
    Ciseaux.from("https://s3-us-west-2.amazonaws.com/pokadotmedia/mbb_part2.mp3").then((tape) => {
      // edit tape
      tape = Ciseaux.concat([ tape.slice(0, 120) ]);

      // render the tape to an AudioBuffer
      return tape.render();
    }).then((audioBuffer) => {
      console.log(audioBuffer);
      var audioContext = new AudioContext();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      console.log(source);
      source.connect(audioContext.destination);
      source.start();
    });
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        <button className='button-rounded' onClick={() => this.createAudioClip()}>
          {"Publish"}
        </button>
      </div>
    )
  }
}

export default ClipAudioPage;
