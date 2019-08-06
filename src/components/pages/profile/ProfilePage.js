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
const STAGE_PODCASTS = 1;

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

const labelInactiveStyle = {
  cursor: 'pointer',
  display: 'inline-block',
  textAlign: 'center',
  color: 'grey',
  fontSize: 18,
  margin: 10,
}

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
      show404: false,
      user: null,
      clips: [],
      podcasts: [],
      stage: STAGE_CLIPS,
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.fetchClips = this.fetchClips.bind(this);
    this.fetchPodcasts = this.fetchPodcasts.bind(this);
    this.toggleStage = this.toggleStage.bind(this);
    this.renderName = this.renderName.bind(this);
    this.renderVerified = this.renderVerified.bind(this);
    this.renderMyProfile = this.renderMyProfile.bind(this);
    this.renderLeftPanel = this.renderLeftPanel.bind(this);
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
        this.fetchPodcasts(data.info.id);
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

  fetchPodcasts(id) {
    BackendManager.makeQuery('stories/user', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          stories: data.stories,
        })
      }
    });
  }

  renderVerified() {
    if (this.state.user.is_creator) {
      return (
        <img
          style={verifiedStyle}
          src='../../../../../images/verified.png'
          />
      );
    }
  }

  renderName() {
    if (this.state.user) {
      return (
        <Row style={{marginTop: 50}}>
          <h2 style={titleStyle}>{this.state.user.first_name + " " + this.state.user.last_name}</h2>
          {this.renderVerified()}
        </Row>
      );
    }
  }

  renderMyProfile() {
    if (this.state.user) {
      if (this.state.user.id == UserManager.id) {
        return (
          <Row style={{marginTop: 20}}>
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

  renderLeftPanel() {
    if (this.state.user) {
      return (
        <div style={{marginTop: 20, marginLeft: 20, width: 250}}>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            <div style={{margin: 10, padding: 10}}>
              <Avatar src={this.state.user.profile_picture} style={profileAvatar} />
              <h3 style={usernameStyle}>{"@" + this.state.user.username}</h3>
            </div>
          </Paper>
        </div>
      );
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
          thumbnail={item.thumbnail_url}
          podcast={item.story_title}
          name={item.username}
          active={item.active}
          handleClick={this.handleItemClick} />
      </div>
    );
  }

  handleItemClick(id) {
    if (this.state.stage == STAGE_CLIPS) {
      if (this.state.user.id == UserManager.id) {
        this.props.history.push('/studio/' + id);
      } else {
        this.props.history.push('/clips/' + id);
      }
    } else {
      this.props.history.push('/story/' + id);
    }
  }

  renderListView() {
    if (this.state.stage == STAGE_CLIPS) {
      return (
        <div>
          <ul>
            {this.state.clips.map((item) => {
              return (this.renderListItem(item))
            })}
          </ul>
        </div>
      );
    } else if (this.state.stage == STAGE_PODCASTS) {
      return (
        <div>
          <ul>
            {this.state.podcasts.map((item) => {
              return (this.renderListItem(item))
            })}
          </ul>
        </div>
      );
    }
  }

  toggleStage(stage) {
    this.setState({
      stage: stage
    });
  }

  renderView() {
    if (this.state.show404) {
      return (
        <BrokenPageSection />
      );
    } else {
      return (
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
          <div style={{width: '100%', height: 1, backgroundColor: 'grey', marginTop: 20}}/>
          <div>
            <p style={this.state.stage==STAGE_CLIPS ? labelActiveStyle : labelInactiveStyle} onClick={() => this.toggleStage(STAGE_CLIPS)}>{"Clips"}</p>
            <p style={this.state.stage==STAGE_PODCASTS ? labelActiveStyle : labelInactiveStyle} onClick={() => this.toggleStage(STAGE_PODCASTS)}>{"Podcasts"}</p>
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
