import React, { Component } from 'react';
import Modal from 'react-modal';
import { withRouter } from "react-router-dom";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MidTitle from '../../../ui/MidTitle.js';
import Button from '../../../ui/Button.js';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';

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

class UploadModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      isPublic: true,
      type: 0,
      isPublicStr: "Anyone",
      selectedFile: null,
      minutes: 0,
      seconds: 0,
    }

    this.renderFileView = this.renderFileView.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.handleSecondsChange = this.handleSecondsChange.bind(this);
  }

  renderFileView() {
    if (this.state.selectedFile != null) {
      return (
        <div>
          <Paper style={storyPaperStyle}>
            <div>
              <Typography style={storyTitleStyle}>
                {this.state.selectedFile.name}
              </Typography>
            </div>
          </Paper>
          <div className={"share"} style={logoContainerStyle} onClick={() => this.removeFile()}><img style={logoStyle} src={"./images/minus.png"} backgroundColor={'transparent'}/></div>
        </div>
      )
    }
  }

  removeFile() {
    this.setState({
      selectedFile: null,
    });
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  handleMinutesChange(e) {
    this.setState({
      minutes: e.target.value
    });
  }

  handleSecondsChange(e) {
    this.setState({
      seconds: e.target.value
    });
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
    console.log(event.target.files[0]);
  }

  render() {
		return (
      <div>
        <h2 style={titleStyle}>Upload a story!</h2>
        <label class="custom-file-upload">
          <input type="file" onChange={this.fileSelectedHandler} accept=".mp4,.mp3,.m4a,.wav"/>
          Select a file
        </label>
        {this.renderFileView()}
        <div>
          <TextField
            label="Title"
            floatingLabelText="Title"
            fullWidth
            style={textFieldStyle}
            value={this.state.title}
            onChange={this.handleTitleChange} />
        </div>
        <TextField
          label="How many minutes?"
          floatingLabelText="How many minutes?"
          style={textFieldStyle}
          value={this.state.minutes}
          onChange={this.handleMinutesChange} />
        <TextField
          label="How many seconds?"
          floatingLabelText="How many seconds?"
          style={textFieldStyle}
          value={this.state.seconds}
          onChange={this.handleSecondsChange} />
        <button className='button-rounded' onClick={() => this.props.uploadFile(this.state.selectedFile, this.state.title, this.state.minutes, this.state.seconds)}>
          Done!
        </button>
      </div>
    )
  }
}

export default withRouter(UploadModal);
