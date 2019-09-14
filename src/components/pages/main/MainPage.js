import React from 'react';
import { Route, NavLink, BrowserRouter, Link,
   Switch, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-grid-system';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import GenreSelect from './components/GenreSelect.js';
import SearchComponent from './components/SearchComponent.js';
import Notifications, {notify} from 'react-notify-toast';

import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import * as Constants from '../../singletons/Constants.js';

import FeedPage from '../feed/FeedPage.js';
import ProfilePage from '../profile/ProfilePage.js';
import EditProfilePage from '../profile/EditProfilePage.js';
import TermsPage from '../about/TermsPage.js';
import PrivacyPolicyPage from '../about/PrivacyPolicyPage.js';
import ClipAudioPage from '../story/ClipAudioPage.js';
import TranscribePage from '../story/TranscribePage.js';
import ClipPage from '../clip/ClipPage.js';
import EditClipPage from '../story/EditClipPage.js';
import TrimContentPage from '../podcast/TrimContentPage.js';
import CreateClipPage from '../story/CreateClipPage.js';
import EditorPage from '../story/EditorPage.js';
import PublishingPage from '../story/PublishingPage.js';
import ClipDetailsPage from '../clip/ClipDetailsPage.js';
import MySponsorsPage from '../sponsor/MySponsorsPage.js';
import TwitterSharePage from '../clip/TwitterSharePage.js';
import EpisodesPage from '../episodes/EpisodesPage.js';
import PodcastPage from '../podcast/PodcastPage.js';
import PodcastGalleryPage from './PodcastGalleryPage.js';

import SignUpModal from './components/SignUpModal.js';
import LoginModal from './components/LoginModal.js';

const drawerWidth = 240;

const customStylesLight = {
	overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(19, 18, 24, 0.75)',
		maxHeight: '100%',
    overflowY: 'auto',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		background: 'rgba(255, 255, 255, 1)',
    transform: 'translate(-50%, -50%)'
  },
};

const customStylesSignUp = {
	overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(19, 18, 24, 0.75)',
		maxHeight: '100%',
    overflowY: 'auto',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		width: '60%',
		maxHeight: '80%',
		background: 'rgba(255, 255, 255, 1)',
    transform: 'translate(-50%, -50%)'
  },
};

const customStyles = {
	overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'rgba(19, 18, 24, 0.75)',
		maxHeight: '100%',
    overflowY: 'auto',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		background: '#18161B',
    transform: 'translate(-50%, -50%)'
  },
};

const panelTitleText = {
	color: '#B8B5BF',
	fontFamily: 'Lato',
	fontSize: 20,
	paddingTop: 15,
	textAlign: 'center',
	fontWeight: 'bold',
}

const logoStyle = {
  width: 30,
  height: 30,
	marginLeft: 10,
	cursor: "pointer",
}

const styles = theme => ({
	main: {
		overflowY: 'hidden',
		backgroundColor: '#F4F3F6',
	},

  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    backgroundColor: '#F4F3F6',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#3ABCBC'
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
		marginRight: 20,
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
    marginBottom: 100,
    minWidth: 0, // So the Typography noWrap works
  },
  flex: {
		flexGrow: 1,
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
  },
	navBarText: {
		flexGrow: 1,
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  menuText: {
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
		font: 'Lato',
  },
  menuSignInText: {
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 30,
    cursor: 'pointer',
  },
  toolbar: theme.mixins.toolbar,
  media: {
    ...theme.mixins.gutters(),
    paddingTop: 70,
    paddingBottom: 70,
    width: 300,
    backgroundColor: '#1D1D1E'
  },
	drawerPaper: {
    position: 'fixed',
    width: drawerWidth,
    backgroundColor: '#2D2D32',
    overflow: 'hidden',
		height: '100%',
  },
	drawer: {
		flexShrink: 0,
    width: drawerWidth,
		['@media (max-width:780px)']: { // eslint-disable-line no-useless-computed-key
      display: 'none',
    },
  },
});

class MainPage extends React.Component {

  componentDidMount() {
		var id = localStorage.getItem('id');
		if (id != null) {
			this.setState({
				isLoggedIn: true,
			});
			var profilePicture = localStorage.getItem('profile_picture');
			var username = localStorage.getItem('username');
			UserManager.id = id;
			UserManager.username = username;
			this.setState({
				profilePicture: profilePicture,
			});
			BackendManager.refreshToken = localStorage.getItem('refresh_token');
			BackendManager.updateToken();
			this.refreshGenres();
		}
  }

  constructor(props) {
    super(props);

    this.state = {
			hideDrawer: false,
      modalIsOpen: false,
			profilePicture: "",
      isSignUp: true,
      isLoggedIn: false,
      signUpText: "Have an account? Login",
			genres: [],
			currentGenre: {
				value: 'All',
				label: 'All',
			},
			clipType: Constants.CLIP_TYPE_TRENDING,
			clipCount: 0,
			clips: [],
			showNotification: false,
    };

		this.refreshGenres = this.refreshGenres.bind(this);
		this.setGenre = this.setGenre.bind(this);
		this.setClipType = this.setClipType.bind(this);
		this.refreshClips = this.refreshClips.bind(this);
		this.getMoreClips = this.getMoreClips.bind(this);

		this.hideDrawer = this.hideDrawer.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.handleAuth = this.handleAuth.bind(this);
		this.setProfilePicture = this.setProfilePicture.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
    this.showToast = this.showToast.bind(this);
		this.setNotification = this.setNotification.bind(this);
    this.logout = this.logout.bind(this);
  }

	refreshGenres() {
		BackendManager.makeQuery('genres/all', JSON.stringify({
		}))
		.then(data => {
			if (data.success) {
				console.log(data);
				var genres = [];
	      for (var i = 0; i < data.genres.length; i++) {
	        var genre = {
	          value: data.genres[i],
	          label: data.genres[i].name,
	        };
	        genres.push(genre);
	      }
	      var genre = {
	        value: 'All',
	        label: 'All',
	      };
	      if (genres.length > 0) {
	        genre = genres[0];
	      }
	      this.setState({
	        genres: genres,
	        currentGenre: genre,
	      });

				this.refreshClips(genre, this.state.clipType);
			}
		});
	}

	setGenre(genre) {
		this.setState({
			currentGenre: genre
		});

		this.refreshClips(genre, this.state.clipType);
	}

	setClipType(clipType) {
		this.setState({
			clipType: clipType
		});

		this.refreshClips(this.state.currentGenre, clipType);
	}

	refreshClips(genre, clipType) {
		if (genre.value.id) {
			BackendManager.makeQuery('clips/genre/count', JSON.stringify({
				genre_id: genre.value.id
			}))
			.then(data => {
				if (data.success) {
					this.setState({
						clipCount: data.count,
					});
				}
			});

			if (clipType == Constants.CLIP_TYPE_TRENDING) {
				BackendManager.makeQuery('clips/genre/trending', JSON.stringify({
					genre_id: genre.value.id
				}))
				.then(data => {
					if (data.success) {
						this.setState({
							clips: data.clips,
						});
					}
				});
			}	else {
				BackendManager.makeQuery('clips/genre/new', JSON.stringify({
					genre_id: genre.value.id
				}))
				.then(data => {
					if (data.success) {
						this.setState({
							clips: data.clips,
						});
					}
				});
			}
		}
	}

	getMoreClips() {
		if (this.state.currentGenre.value.id) {
			if (this.state.clipType == Constants.CLIP_TYPE_TRENDING) {
				BackendManager.makeQuery('clips/genre/trending/cont', JSON.stringify({
					genre_id: this.state.currentGenre.value.id,
					score: this.state.clips[this.state.clips.length - 1].score,
				}))
				.then(data => {
					if (data.success) {
						var clips = this.state.clips;
						clips.push.apply(clips, data.clips);
						this.setState({
							clips: clips,
						});
					}
				});
			}	else {
				BackendManager.makeQuery('clips/genre/new/cont', JSON.stringify({
					genre_id: this.state.currentGenre.value.id,
					clip_id: this.state.clips[this.state.clips.length - 1].id,
				}))
				.then(data => {
					if (data.success) {
						var clips = this.state.clips;
						clips.push.apply(clips, data.clips);
						this.setState({
							clips: clips,
						});
					}
				});
			}
		}
	}

	hideDrawer(t) {
		this.setState({
			hideDrawer: t,
		});
	}

  openModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handleAuth() {
    this.setState({
      isLoggedIn: true,
    });
  }

	setProfilePicture(profilePicture) {
		this.setState({
			profilePicture: profilePicture,
		});
	}

  toggleSignUp() {
		var signUp = !this.state.isSignUp;
		var signUpText = "Have an account? Login";
		if (!signUp) {
			signUpText = "Don't have an account? Sign Up";
		}
		this.setState({isSignUp: signUp, signUpText: signUpText});
	}

  showToast(toast, type) {
		if (type == "custom") {
			let customColor = { background: '#6175E0', text: "#FFFFFF" };
			notify.show(toast, "custom", 5000, customColor);
		} else {
			notify.show(toast, type);
		}
  }

	setNotification(showNotification) {
		this.setState({
			showNotification: showNotification,
		});
	}

  logout() {
    localStorage.clear();
    this.setState({
      isLoggedIn: false,
    });
  }

  render() {
    const { classes } = this.props;
    const content = this.props.content;

    return (
      <BrowserRouter className={classes.main}>
        <div className={classes.main}>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStylesSignUp}
            contentLabel="Sign Up"
          >
            {this.state.isSignUp ? <SignUpModal setProfilePicture={this.setProfilePicture} handleAuth={() => this.handleAuth()} closeModal={this.closeModal}/>
						: <LoginModal showToast={this.showToast} setProfilePicture={this.setProfilePicture} handleAuth={() => this.handleAuth()} closeModal={this.closeModal}/>}
            <button className="demo-link-red" style={{cursor: 'pointer'}} onClick={this.toggleSignUp}>
              {this.state.signUpText}
            </button>
          </Modal>
          <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <NavLink exact to="/"><img style={logoStyle} src={"https://s3-us-west-2.amazonaws.com/pokadotmedia/icon_1024.png"}/></NavLink>
                <NavLink exact to="/" className={classes.titleText}>Riptide</NavLink>
								<GenreSelect genres={this.state.genres} genre={this.state.currentGenre} setGenre={this.setGenre}/>
								<SearchComponent setGenre={this.setGenre}/>
								<div className={classes.flex}/>
                {this.state.isLoggedIn ?
									<div>
										<NavLink to={"/profile/" + UserManager.username}>
											<Avatar style={logoStyle} src={this.state.profilePicture}/>
										</NavLink>
									</div> :
                  <p className={classes.menuSignInText} onClick={() => this.openModal()}>Sign In</p>}
              </Toolbar>
            </AppBar>

            <main className={classes.content} style={{backgroundColor: '#F4F3F6'}}>
              <div className={classes.toolbar} />
                <div className="content">
								<Switch>
                  <Route
                    exact path='/'
                    render={(props) =>
                      <FeedPage {...props}
												isLoggedIn={this.state.isLoggedIn}
												openLoginModal={this.openModal}
												showToast={this.showToast}
												clipType={this.state.clipType}
												setClipType={this.setClipType}
												clipCount={this.state.clipCount}
												clips={this.state.clips}
												getMoreClips={this.getMoreClips}
                      />}
                  />
									<Route path="/terms" component={TermsPage}/>
									<Route path="/privacy" component={PrivacyPolicyPage}/>
									<Route
                    exact path='/edit'
                    render={(props) =>
                      <EditProfilePage {...props}
												isLoggedIn={this.state.isLoggedIn}
												setProfilePicture={this.setProfilePicture}
                        showToast={this.showToast}
                      />}
                  />
									<Route
                    path="/clips/:id"
                    render={(props) =>
                      <ClipPage {...props}
												isLoggedIn={this.state.isLoggedIn}
												openLoginModal={this.openModal}
												showToast={this.showToast}
												setNotification={this.setNotification}
											/>}
                  />
									<Route
                    path="/podcast/:id"
                    render={(props) =>
                      <PodcastPage {...props}
												isLoggedIn={this.state.isLoggedIn}
												openLoginModal={this.openModal}
												showToast={this.showToast}
												setNotification={this.setNotification}
											/>}
                  />
									<Route exact path="/search"
										render={(props) =>
											<PodcastGalleryPage {...props}
											/>}
									/>
									<Route exact path="/episodes"
										render={(props) =>
											<EpisodesPage {...props}
											/>}
									/>
                  <Route
                    path="/profile/:id"
                    render={(props) => <ProfilePage
                      {...props}
											logout={this.logout}
                    />}
                  />
									<Route
                    path="/editor"
                    render={(props) =>
											<TrimContentPage
	                      {...props}
												showToast={this.showToast}
	                    />}
                  />
									<Route
                    path="/publishing"
                    render={(props) =>
											<PublishingPage
	                      {...props}
	                    />}
                  />
									<Route
                    path="/studio/:id"
                    render={(props) =>
											<ClipDetailsPage
	                      {...props}
	                    />}
                  />
									<Redirect from='*' to='/' />
									</Switch>
                </div>
            </main>
          </div>
					<Notifications />
        </div>
      </BrowserRouter>
    );
  }
}

MainPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainPage);
