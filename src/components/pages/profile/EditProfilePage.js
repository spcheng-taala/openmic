import React, { Component } from 'react';
import { Container, Row } from 'react-grid-system';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import { Helmet } from 'react-helmet';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';

const root = {
  margin: 20,
}

const textFieldStyle = {
  color: "#222225",
  fontFamily: "Lato",
  marginTop: 10,
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "left",
}

const bigAvatar = {
  marginLeft: 40,
  marginTop: 20,
  marginBottom: 20,
  width: 100,
  height: 100,
}

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: 'Lato',
  },
  textFieldLabelRoot: {
    fontFamily: 'Lato',
  }
});

class EditProfilePage extends Component {

  componentDidMount() {
    if (localStorage.getItem('id') != null) {
      this.setState({
        username: localStorage.getItem('username'),
        profilePicture: localStorage.getItem('profile_picture'),
      })
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      profilePicture: "",
      validUsername: false,
      selectedFile: null,
      file: null,
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.renderProfilePicture = this.renderProfilePicture.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
    BackendManager.makeQuery('users/check/username', JSON.stringify({
      username: this.state.username,
    }))
    .then(data => {
      this.setState({validUsername: data.success});
    });
  }

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      file: URL.createObjectURL(event.target.files[0]),
    });
    console.log(event.target.files[0]);
  }

  renderBasicInfo(classes) {
    return (
      <div style={root}>
        <TextField
          label="Username"
          floatingLabelText="Email"
          style={textFieldStyle}
          fullWidth
          value={this.state.username}
          InputProps={{ classes: { root: classes.textFieldInputRoot } }}
          InputLabelProps={{
            FormLabelClasses: {
              root: classes.textFieldLabelRoot
            }
          }}
          onChange={this.handleUsernameChange}/>
      </div>
    );
  }

  renderProfilePicture() {
    if (this.state.selectedFile != null) {
      return (
        <Avatar src={this.state.file} style={bigAvatar} />
      );
    } else {
      return (
        <Avatar src={this.state.profilePicture} style={bigAvatar} />
      );
    }
  }

  updateProfile() {
    if (this.state.selectedFile != null) {
      var url = "https://s3-us-west-2.amazonaws.com/riptide-images/";
      const formData = new FormData();
      formData.append('file', this.state.selectedFile);
      axios.post(`https://api.mypokadot.com/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
  			if (data.data.success) {
          var imageUrl = url + data.data.title.split(' ').join('+');
          BackendManager.makeQuery('users/profile/update', JSON.stringify({
            username: this.state.username,
            profile_picture: imageUrl,
            id: UserManager.id,
          }))
          .then(data => {
            localStorage.setItem('username', this.state.username);
            localStorage.setItem('profile_picture', imageUrl);
            this.props.showToast("Done!", 'custom');
            this.setState({validUsername: data.success});
            this.props.setProfilePicture(imageUrl);
          });
  			}
      }).catch(error => {
        // handle your error
      });
    } else {
      BackendManager.makeQuery('users/profile/update', JSON.stringify({
        username: this.state.username,
        profile_picture: this.props.profilePicture,
        id: UserManager.id,
      }))
      .then(data => {
        localStorage.setItem('username', this.state.username);
        this.props.showToast("Done!", 'success');
        this.setState({validUsername: data.success});
      });
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={root}>
        <Helmet>
          <title>{"Edit Profile - Riptide"}</title>
        </Helmet>
        <Container>
          <h2 style={titleStyle}>Edit your profile</h2>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            <Row>
              {this.renderProfilePicture()}
              <label class="custom-file-upload">
                <input type="file" onChange={this.fileSelectedHandler} accept=".jpg,.png,.jpeg"/>
                Upload a profile picture
              </label>
            </Row>
          </Paper>
          <Paper elevation={1} style={{backgroundColor: 'white', marginTop: 10, paddingTop: 5, paddingBottom: 10}}>
            {this.renderBasicInfo(classes)}
          </Paper>
          <button className='button-rounded' onClick={() => this.updateProfile()}>Done!</button>
        </Container>
      </div>
    )
  }
}

export default withStyles(styles)(EditProfilePage);
