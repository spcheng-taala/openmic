import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import BrokenPageSection from '../../sections/BrokenPageSection.js';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import ClipItem from './components/ClipItem.js';

const STAGE_CLIPS = 0;

const labelActiveStyle = {
  cursor: 'pointer',
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'underline',
  fontWeight: 'bold',
  color: '#FF0081',
  fontSize: 18,
  margin: 10,
}

const centerVertical = {
  margin: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
}

const usernameStyle = {
  color: '#555555',
  fontFamily: 'Lato',
  textAlign: 'left',
  fontWeight: 'bold',
	fontSize: 25,
}

const profileAvatar = {
  width: 100,
  height: 100,
  display: 'block',
  marginTop: 20,
  marginLeft: 'auto',
  marginRight: 'auto',
}

class ProfilePage extends Component {

  componentDidMount() {
    this.fetchUser(this.props.match.params.id);
  }

  constructor(props) {
    super(props);

    this.state = {
      show404: false,
      user: null,
      clips: [],
      podcasts: [],
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.fetchClips = this.fetchClips.bind(this);
    this.renderMyProfile = this.renderMyProfile.bind(this);
    this.renderProfileButtons = this.renderProfileButtons.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.renderListView = this.renderListView.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.logout = this.logout.bind(this);
    this.renderView = this.renderView.bind(this);
  }

  fetchUser(username) {
    BackendManager.makeQuery('users/basic/username', JSON.stringify({
      username: username,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          user: data.info,
        });
        this.fetchClips(data.info.id);
      } else {
        this.setState({
          show404: true,
        });
      }
    });
  }

  fetchClips(id) {
    BackendManager.makeQuery('clips/user', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          clips: data.clips,
        })
      }
    });
  }

  renderMyProfile() {
    if (this.state.user) {
      return (
        <Row style={{marginTop: 50}}>
          <Avatar src={this.state.user.profile_picture} style={{marginBottom: 10, marginLeft: 30, marginTop: 10, width: 150, height: 150, display: 'inline-block'}} />
          <Col>
            <div style={centerVertical}>
              <Typography style={usernameStyle}>
                {'@' + this.state.user.username}
              </Typography>
              {this.renderProfileButtons()}
            </div>
          </Col>
        </Row>
      );
    }
  }

  renderProfileButtons() {
    if (this.state.user) {
      if (this.state.user.id == UserManager.id) {
        return (
          <Row style={{marginTop: 5, marginLeft: 10}}>
            <button className='button-rounded-purple-no-mar-small' onClick={() => this.props.history.push('/edit')}>
              {"Edit Profile"}
            </button>
            <button className='button-rounded-red-no-mar-small-empty' onClick={() => this.logout()}>
              {"Logout"}
            </button>
          </Row>
        );
      }
    }
  }

  logout() {
    this.props.logout();
    this.props.history.push('/');
  }

  renderListItem(item) {
    return (
      <div style={{marginBottom: 30}} key={item.id}>
        <ClipItem
          id={item.uuid}
          url={item.url}
          title={item.title}
          thumbnail={item.podcast_thumbnail}
          podcast={item.podcast_title}
          name={item.username}
          active={item.active}
          handleClick={this.handleItemClick} />
      </div>
    );
  }

  handleItemClick(id) {
    if (this.state.user.id == UserManager.id) {
      this.props.history.push('/studio/' + id);
    } else {
      this.props.history.push('/clips/' + id);
    }
  }

  renderListView() {
    return (
      <div>
        <ul>
          {this.state.clips.map((item) => {
            return (this.renderListItem(item))
          })}
        </ul>
      </div>
    );
  }

  renderView() {
    if (this.state.show404) {
      return (
        <BrokenPageSection />
      );
    } else {
      return (
        <Container>
          {this.renderMyProfile()}
          <div style={{width: '100%', height: 1, backgroundColor: 'grey', marginTop: 20}}/>
          <div>
            <p style={labelActiveStyle}>{"Clips"}</p>
          </div>
          {this.renderListView()}
        </Container>
      );
    }
  }

  render() {
		return (
      <div>
        {this.renderView()}
      </div>
    )
  }
}

export default ProfilePage;
