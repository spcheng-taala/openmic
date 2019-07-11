import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import classNames from 'classnames';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
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
        firstName: localStorage.getItem('first_name'),
        lastName: localStorage.getItem('last_name'),
        username: localStorage.getItem('username'),
        bio: localStorage.getItem('bio'),
        profilePicture: localStorage.getItem('profile_picture'),
      })
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      profilePicture: "",
      validUsername: false,
      bio: "",
      referralCode: "",
      selectedFile: null,
      file: null,
    }

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.renderProfilePicture = this.renderProfilePicture.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.renderFreeGems = this.renderFreeGems.bind(this);
    this.handleReferralChange = this.handleReferralChange.bind(this);
    this.handleReferralCodeClick = this.handleReferralCodeClick.bind(this);
  }

  handleFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
    console.log(e.target.value);
  }

  handleLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
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

  handleBioChange(e) {
    this.setState({
      bio: e.target.value
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
        <TextField label="First Name"
          floatingLabelText="First Name"
          style={textFieldStyle}
          fullWidth
          value={this.state.firstName}
          InputProps={{ classes: { root: classes.textFieldInputRoot } }}
          InputLabelProps={{
            FormLabelClasses: {
              root: classes.textFieldLabelRoot
            }
          }}
          onChange={this.handleFirstNameChange}/>
        <TextField
          label="Last Name"
          floatingLabelText="Last Name"
          style={textFieldStyle}
          fullWidth
          value={this.state.lastName}
          InputProps={{ classes: { root: classes.textFieldInputRoot } }}
          InputLabelProps={{
            FormLabelClasses: {
              root: classes.textFieldLabelRoot
            }
          }}
          onChange={this.handleLastNameChange}/>
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

  handleReferralCodeClick() {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('codes/check/code', JSON.stringify({
        name: this.state.referralCode,
      }))
      .then(data => {
        this.setState({
          referralCode: ""
        });
        if (data.success) {
          var code = data.code;
          BackendManager.makeQuery('codes/check/user', JSON.stringify({
            user_id: UserManager.id,
            code_id: code.id,
          }))
          .then(data => {
            if (data.success) {
              BackendManager.makeQuery('codes/count', JSON.stringify({
                code_id: code.id,
              }))
              .then(data => {
                if (data.success) {
                  if (code.limit > data.count) {
                    BackendManager.makeQuery('codes/user/add', JSON.stringify({
                      user_id: UserManager.id,
                      code_id: code.id
                    }))
                    .then(data => {
                      if (data.success) {
                        BackendManager.makeQuery('gems/user/update', JSON.stringify({
                          gem_count: code.amount,
                          user_id: UserManager.id
                        }))
                        .then(data => {
                          if (data.success) {
                            var text = "You just received " + code.amount + " Gems!";
                            this.props.openGemGifModal(code.amount, text);
                          }
                        });
                      }
                    });
                  } else {
                    this.props.showToast("This referral has expired :(", 'error');
                  }
                }
              });
            } else {
              this.props.showToast("Oops! Looks like you've already used this referral code", 'error');
            }
          });
        } else {
          this.props.showToast("Hmm, this referral code doesn't seem to exist", 'error');
        }
      });
    }
  }

  updateProfile() {
    if (this.state.selectedFile != null) {
      var d = new Date();
      var seconds = d.getTime() / 1000;
      var fileName = UserManager.id + "_" + seconds;
      var ext = ".jpg";
      if (this.state.selectedFile.type == "image/png") {
        url += ".png";
      } else {
        url += ".jpg";
      }

      var url = "https://s3-us-west-2.amazonaws.com/riptide-images/";
      const formData = new FormData();
      formData.append('file', this.state.selectedFile);
      axios.post(`https://api.mypokadot.com/pp/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
  			if (data.data.success) {
          var imageUrl = url + data.data.title.split(' ').join('+');
          BackendManager.makeQuery('users/profile/update', JSON.stringify({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            username: this.state.username,
            bio: this.state.bio,
            profile_picture: imageUrl,
            id: UserManager.id,
          }))
          .then(data => {
            localStorage.setItem('first_name', this.state.firstName);
            localStorage.setItem('last_name', this.state.lastName);
            localStorage.setItem('username', this.state.username);
            localStorage.setItem('bio', this.state.bio);
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
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        username: this.state.username,
        bio: this.state.bio,
        profile_picture: this.props.profilePicture,
        id: UserManager.id,
      }))
      .then(data => {
        localStorage.setItem('first_name', this.state.firstName);
        localStorage.setItem('last_name', this.state.lastName);
        localStorage.setItem('username', this.state.username);
        localStorage.setItem('bio', this.state.bio);
        this.props.showToast("Done!", 'success');
        this.setState({validUsername: data.success});
      });
    }
  }

  handleReferralChange(e) {
    this.setState({
      referralCode: e.target.value
    });
  }

  renderFreeGems(classes) {
    return (
      <div style={{marginTop: 20, marginBottom: 20, width: 250}}>
        <Paper elevation={1} style={{backgroundColor: 'white'}}>
          <div style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}>
            <h3 style={titleStyle}>
              {"Have a referral code? Enter it here to get free gems!"}
            </h3>
            <div style={{margin: 10}}>
              <TextField
                id="outlined-adornment-amount"
                placeholder="Enter Code"
                fullWidth
                inputProps={{min: 0, style: { textAlign: 'center' }}}
                value={this.state.referralCode}
                InputProps={{ classes: { root: classes.textFieldInputRoot } }}
                InputLabelProps={{
                  FormLabelClasses: {
                    root: classes.textFieldLabelRoot
                  }
                }}
                onChange={this.handleReferralChange} />
            </div>
            <button className='button-rounded-purple' onClick={() => this.handleReferralCodeClick()}>
              {"Enter"}
            </button>
            <div style={{paddingBottom: 10}}>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={root}>
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
          {this.renderFreeGems(classes)}
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            {this.renderBasicInfo(classes)}
            <div style={{marginLeft: 10, marginRight: 10, marginBottom: 20}}>
              <TextField
                id="outlined-adornment-amount"
                label="Write your bio"
                multiline
                fullWidth
                rows="4"
                value={this.state.bio}
                InputProps={{ classes: { root: classes.textFieldInputRoot } }}
                InputLabelProps={{
                  FormLabelClasses: {
                    root: classes.textFieldLabelRoot
                  }
                }}
                onChange={this.handleBioChange}
                margin="normal"
                variant="outlined"
              />
            </div>
          </Paper>
          <button className='button-rounded' onClick={() => this.updateProfile()}>Done!</button>
        </Container>
      </div>
    )
  }
}

export default withStyles(styles)(EditProfilePage);
