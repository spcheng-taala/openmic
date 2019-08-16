import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import SponsorWelcomeSection from './components/SponsorWelcomeSection.js';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import SponsorItem from './components/SponsorItem.js';

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

class MySponsorsPage extends Component {

  componentDidMount() {
    var id = localStorage.getItem('id');
    if (id) {
      UserManager.id = id;
      this.fetchSponsors(id);
      this.props.setNotification(false);
    } else {
      this.props.openLoginModal();
    }

    this.setState({
      showWelcomePage: true,
    });


    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    if (window.innerWidth <= 760) {
      this.setState({
        isMobile: true,
      });
    } else {
      this.setState({
        isMobile: false,
      })
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      showWelcomePage: false,
      isMobile: false,
      sponsors: [],
    };

    this.fetchSponsors = this.fetchSponsors.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.renderListView = this.renderListView.bind(this);
    this.renderView = this.renderView.bind(this);
    this.handleSponsorClick = this.handleSponsorClick.bind(this);
  }

  fetchSponsors(id) {
    BackendManager.makeQuery('sponsors/user', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        var showWelcomePage = true;
        if (data.sponsors.length > 0) {
          showWelcomePage = false;
        }
        this.setState({
          sponsors: data.sponsors,
          showWelcomePage: showWelcomePage,
        });
      }
    });
  }

  handleSponsorClick(sponsor) {
    BackendManager.makeQuery('sponsors/click', JSON.stringify({
      story_id: sponsor.story_id,
      sponsor_id: sponsor.id,
    }));
    window.open(sponsor.link, "_blank");
  }

  renderListItem(item, i) {
    return (
      <div style={{marginBottom: 30}} key={item.id}>
        <SponsorItem isMobile={this.state.isMobile} index={i} sponsor={item} handleSponsorClick={this.handleSponsorClick}/>
      </div>
    );
  }

  renderListView() {
    return (
      <div>
        <ul>
          {this.state.sponsors.map((item, i) => {
            return (this.renderListItem(item, i))
          })}
        </ul>
      </div>
    );
  }

  renderView() {
    if (this.state.showWelcomePage) {
      return (
        <Container>
          <h1 style={{fontWeight: 'bold', fontSize: 50}}>{'My Deals'}</h1>
          <SponsorWelcomeSection signIn={this.props.openLoginModal} isLoggedIn={this.props.isLoggedIn}/>
        </Container>
      );
    } else {
      return (
        <Container>
          <h1 style={{fontWeight: 'bold', fontSize: 50}}>{'My Deals'}</h1>
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

export default MySponsorsPage;
