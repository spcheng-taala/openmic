import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MidTitle from '../../ui/MidTitle.js';
import Button from '../../ui/Button.js';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import videoshow from './utils/videoshow.js';

const visibility = [
  'Anyone',
  'Only Followers',
];

const textFieldStyle = {
  color: "#222225",
  font: "Lato",
  marginTop: 10,
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}

const logoContainerStyle = {
  marginTop: -10,
  marginLeft: 15,
  float: "right",
  width: 20,
}

const logoStyle = {
  width: 20,
  height: 20,
  cursor: 'pointer',
}

var storyPaperStyle = {
  marginTop: 10,
  padding: 10,
}

var storyTitleStyle = {
  paddingLeft: 10,
  align: 'center',
  color: '#222225',
  fontFamily: "Lato",
  fontSize: 16,
}

const inputStyle = {
  visibility: 'hidden',
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class PreviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      stage: 0,
      selectedImageFile: null,
      selectedAudioFile: null,
    }

    this.renderImage = this.renderImage.bind(this);
    this.renderUpload = this.renderUpload.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.createVideoRender = this.createVideoRender.bind(this);
  }

  renderImage() {
    if (this.state.selectedImageFile != null) {
      var file = URL.createObjectURL(this.state.selectedImageFile)
      return (
        <img className="instagram-box" src={file} style={{display: 'block', marginLeft: 'auto',
        marginRight: 'auto'}}/>
      );
    }
  }

  renderUpload() {
    if (this.state.stage == 0) {
      return (
        <div>
          <label class="custom-file-upload" style={{width: 300}}>
            <input type="file" onChange={this.imageFileSelectedHandler} accept=".jpg,.png,.jpeg"/>
            {"Let's start with a cover image!"}
          </label>
        </div>
      )
    } else if (this.state.stage == 1) {
      return (
        <label class="custom-file-upload" style={{width: 350}}>
          <input type="file" onChange={this.audioFileSelectedHandler} accept=".mp4,.mp3,.m4a,.wav"/>
          {"Add an audio file you've already made!"}
        </label>
      )
    } else if (this.state.stage == 2) {
      return (
        <div>
          <button className='button-rounded' onClick={() => this.createVideoRender()}>
            {"Publish"}
          </button>
        </div>
      );
    }
  }

  createVideoRender() {
    var images = [URL.createObjectURL(this.state.selectedImageFile)];
    var videoOptions = {
      fps: 25,
      videoBitrate: 1024,
      videoCodec: 'libx264',
      audioBitrate: '128k',
      audioChannels: 2,
      format: 'mp4',
      pixelFormat: 'yuv420p'
    }

    videoshow(images, videoOptions)
    .audio(URL.createObjectURL(this.state.selectedAudioFile))
    .save('video.mp4')
    .on('start', function (command) {
      console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
      console.error('Error:', err)
      console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
      console.error('Video created in:', output)
    })
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  imageFileSelectedHandler = event => {
    this.setState({
      stage: 1,
      selectedImageFile: event.target.files[0]
    });
  }

  audioFileSelectedHandler = event => {
    this.setState({
      stage: 2,
      selectedAudioFile: event.target.files[0]
    });
  }

  render() {
		return (
      <div>
        <Container>
          <h2 style={titleStyle}>{"Create a preview"}</h2>
          {this.renderImage()}
          {this.renderUpload()}
          <div>
            <TextField
              label="Title"
              floatingLabelText="Title"
              fullWidth
              style={textFieldStyle}
              value={this.state.title}
              onChange={this.handleTitleChange} />
          </div>
        </Container>
      </div>
    )
  }
}

export default withRouter(PreviewPage);
