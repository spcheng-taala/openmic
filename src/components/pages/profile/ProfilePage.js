import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "left",
  fontSize: 35,
  marginTop: 20,
  marginBottom: 0,
}

const usernameStyle = {
  color: "#555555",
  font: "Lato",
  textAlign: "center",
  fontSize: 25,
  paddingBottom: 20,
}

const textStyle = {
  color: "#555555",
  font: "Lato",
  margin: 20,
  textAlign: "left",
  fontSize: 17,
}

const profileAvatar = {
  width: 100,
  height: 100,
  display: 'block',
  marginTop: 20,
  marginLeft: 'auto',
  marginRight: 'auto',
}

const verifiedStyle = {
  marginLeft: 10,
  width: 30,
  height: 30,
  marginTop: 30,
  display: 'inline-block',
}

class ProfilePage extends Component {

  componentDidMount() {
    this.fetchUser(this.props.match.params.id);
  }

  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.renderName = this.renderName.bind(this);
    this.renderMyProfile = this.renderMyProfile.bind(this);
    this.renderLeftPanel = this.renderLeftPanel.bind(this);
  }

  fetchUser(userId) {
    BackendManager.makeQuery('users/basic', JSON.stringify({
      user_id: userId,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          user: data.info,
        })
      }
    });
  }

  renderName() {
    if (this.state.user) {
      if (this.state.user.is_creator) {
        return (
          <Row>
            <h2 style={titleStyle}>{this.state.user.first_name + " " + this.state.user.last_name}</h2>
            <img
              style={verifiedStyle}
              src='../../../../../images/verified.png'
              />
          </Row>
        );
      } else {
        return (
          <Row>
            <h2 style={titleStyle}>{this.state.user.first_name + " " + this.state.user.last_name}</h2>
          </Row>
        );
      }
    }
  }

  renderMyProfile() {
    if (this.state.user) {
      if (this.state.user.id == UserManager.id) {
        return (
          <Row style={{marginTop: 20}}>
            <button className='button-rounded-purple-no-mar-small'>
              {"Edit Profile"}
            </button>
            <button className='button-rounded-red-no-mar-small-empty'>
              {"Logout"}
            </button>
          </Row>
        );
      }
    }
  }

  renderLeftPanel() {
    if (this.state.user) {
      return (
        <div style={{marginTop: 20, marginLeft: 20, width: 250}}>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            <div style={{margin: 10, padding: 20}}>
              <Avatar src={this.state.user.profile_picture} style={profileAvatar} />
              <h3 style={usernameStyle}>{"@" + this.state.user.username}</h3>
            </div>
          </Paper>
        </div>
      );
    }
  }

  render() {
		return (
      <div>
        <Container>
          <Row>
            <Col md={4}>
              {this.renderLeftPanel()}
            </Col>
            <Col md={8}>
              {this.renderName()}
              {this.renderMyProfile()}
              {this.state.user ? <p style={textStyle}>{this.state.user.bio}</p> : <div/>}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default ProfilePage;
