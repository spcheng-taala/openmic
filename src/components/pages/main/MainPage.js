import React from 'react';
import { Route, NavLink, BrowserRouter,
   Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import GenreSelect from './components/GenreSelect.js';
import SearchComponent from './components/SearchComponent.js';
import Notifications, {notify} from 'react-notify-toast';

import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import * as Constants from '../../singletons/Constants.js';

import FeedPage from '../feed/FeedPage.js';
import CreateClipPage from '../feed/CreateClipPage.js';
import ProfilePage from '../profile/ProfilePage.js';
import EditProfilePage from '../profile/EditProfilePage.js';
import TermsPage from '../about/TermsPage.js';
import PrivacyPolicyPage from '../about/PrivacyPolicyPage.js';
import BestPodcastPage from '../about/BestPodcastPage.js';
import ClipPage from '../clip/ClipPage.js';
import TrimContentPage from '../podcast/TrimContentPage.js';
import ClipDetailsPage from '../clip/ClipDetailsPage.js';
import EpisodesPage from '../episodes/EpisodesPage.js';
import PodcastPage from '../podcast/PodcastPage.js';
import PublishingPage from '../podcast/PublishingPage.js';
import PlaylistPage from '../playlist/PlaylistPage.js';
import GenresPage from '../genres/GenresPage.js';
import PodcastGalleryPage from './PodcastGalleryPage.js';

import SignUpModal from './components/SignUpModal.js';
import LoginModal from './components/LoginModal.js';

const drawerWidth = 240;

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

const logoStyle = {
  width: 30,
  height: 30,
	marginLeft: 10,
	marginRight: 10,
	cursor: "pointer",
}

const likeCountText = {
	color: '#D14C85',
	fontSize: 14,
	marginLeft: 10,
	marginRight: 5,
	fontWeight: 'bold'
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
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 20,
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
			this.refreshTotalLikeCount();
		}

		this.refreshGenres();
		window.addEventListener('resize', this.resize.bind(this));
		this.resize();
  }

	componentWillUnmount() {
    window.removeEventListener('resize', this.resize, false);
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
			isMobile: false,
			hideDrawer: false,
      modalIsOpen: false,
			profilePicture: "",
      isSignUp: true,
      isLoggedIn: false,
			totalLikeCount: 0,
      signUpText: "Have an account? Login",
			allGenres: [],
			followedGenres: [],
			genres: [],
			currentGenre: {
				value: {
					id: -1,
					name: 'All'
				},
				label: 'All',
			},
			clipType: Constants.CLIP_TYPE_TRENDING,
			clipCount: 0,
			clips: [],
			showNotification: false,
    };

		this.refreshGenres = this.refreshGenres.bind(this);
		this.refreshTopGenres = this.refreshTopGenres.bind(this);
		this.refreshTotalLikeCount = this.refreshTotalLikeCount.bind(this);
		this.setGenre = this.setGenre.bind(this);

		this.addGenre = this.addGenre.bind(this);
		this.handleFollowGenreClick = this.handleFollowGenreClick.bind(this);

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
		if (this.state.genres.length === 0) {
			if (UserManager.id == 0) {
				this.refreshTopGenres([]);
			} else {
				BackendManager.makeQuery('genres/user', JSON.stringify({
					user_id: UserManager.id,
				}))
				.then(data => {
					if (data.success) {
						this.setState({
							followedGenres: data.genres,
						});
						this.refreshTopGenres(data.genres);
					}
				});
			}
		}
	}

	refreshTopGenres(genres) {
		BackendManager.makeQuery('genres/top', JSON.stringify({
			genres: genres,
		}))
		.then(data => {
			if (data.success) {
				var topGenres = [];
				for (var i = 0; i < data.genres.length; i++) {
					var genre = {
						value: data.genres[i],
						label: data.genres[i].name,
					};
					topGenres.push(genre);
				}

				topGenres.push({
					value: {
						id: -1,
						name: "View all genres"
					},
					label: "View all genres"
				});
				if (genres.length > 0) {
					var followedGenres = [];
					for (var i = 0; i < genres.length; i++) {
						followedGenres.push({
							label: genres[i].name,
							value: {id: genres[i].id, name: genres[i].name}
						});
					}
					this.setState({
						allGenres: [
							{
								options: followedGenres,
								label: 'Subscribed',
							},
							{
								options: topGenres,
								label: 'Top Genres',
							},
						]
					});
				} else {
					this.setState({
						allGenres: [
							{
								options: topGenres,
								label: 'Top Genres',
							}
						]
					})
				}
				this.setState({
					genres: topGenres,
				});
			}
		});
	}

	refreshTotalLikeCount() {
		BackendManager.makeQuery('clips/like/total', JSON.stringify({
			user_id: UserManager.id
		}))
		.then(data => {
			if (data.success) {
				this.setState({
					totalLikeCount: data.like_count,
				});
			}
		});
	}

	setGenre(genre) {
		this.setState({
			currentGenre: genre
		});
	}

	addGenre(genre) {
		var genres = this.state.genres;
		genres.push(genre);
		this.setState({
			genres: genres,
		});
	}

	handleFollowGenreClick(genre) {
		var followedGenres = this.state.followedGenres;
		var hasGenre = false;
		var index = 0;
		for (var i = 0; i < followedGenres.length; i++) {
			if (followedGenres[i].id == genre.id) {
				hasGenre = true;
				index = i;
			}
		}
		var active = 1;
		if (hasGenre) {
			active = 0;
		}
		BackendManager.makeQuery('genres/user/create', JSON.stringify({
			user_id: UserManager.id,
			genre_id: genre.id,
			active: active,
		}))
		.then(data => {
			if (data.success) {
				var topGenres = this.state.genres;
				if (hasGenre) {
					followedGenres.splice(index, 1);
					var g = {label: genre.name, value: {id: genre.id, name: genre.name}};
					topGenres.splice(topGenres.length - 1, 0, g);
				} else {
					followedGenres.push(genre);
					var isInTop = false;
					var i = 0;
					for (var i = 0; i < topGenres.length; i++) {
						if (topGenres[i].value.id == genre.id) {
							isInTop = true;
							index = i;
						}
					}
					if (isInTop) {
						topGenres.splice(index, 1);
					}
				}
				if (followedGenres.length > 0) {
					var genres = [];
					for (var i = 0; i < followedGenres.length; i++) {
						genres.push({
							label: followedGenres[i].name,
							value: {id: followedGenres[i].id, name: followedGenres[i].name}
						});
					}
					this.setState({
						allGenres: [
							{
								options: genres,
								label: 'Subscribed',
							},
							{
								options: topGenres,
								label: 'Top Genres',
							},
						]
					});
				} else {
					this.setState({
						allGenres: [
							{
								options: topGenres,
								label: 'Top Genres',
							}
						]
					})
				}
				this.setState({
					followedGenres: followedGenres
				});
			}
		});
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
		if (type === "custom") {
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
                <NavLink exact to="/"><img style={logoStyle} alt={"logo"} src={"https://s3-us-west-2.amazonaws.com/pokadotmedia/icon_1024.png"}/></NavLink>
								{this.state.isMobile ?
									<div/> : <NavLink exact to="/" className={classes.titleText}>Riptide</NavLink>
								}
								<GenreSelect isMobile={this.state.isMobile} genres={this.state.allGenres} genre={this.state.currentGenre} setGenre={this.setGenre}/>
								<SearchComponent setGenre={this.setGenre}/>
								{this.state.isLoggedIn ?
									<NavLink exact to="/playlist" style={{paddingTop: 20}}>
										<button className='button-rounded-no-mar-bordered' style={{marginLeft: 10}}>{'Playlist'}</button>
									</NavLink>
									: <div/>
								}
								{this.state.isLoggedIn ?
									<p style={likeCountText}>{UtilsManager.createNumberString(this.state.totalLikeCount)}</p> : <div/>
								}
								{this.state.isLoggedIn ?
									<img style={{width: 25, height: 25}} src={'../../../../../images/heart_filled.png'} alt={'likes'} /> : <div/>
								}
                {this.state.isLoggedIn ?
									<div>
										<NavLink to={"/profile/" + UserManager.username}>
											<Avatar style={logoStyle} src={this.state.profilePicture}/>
										</NavLink>
									</div> :
                  <p className={classes.menuSignInText} onClick={() => this.openModal()}>Sign In</p>}
              </Toolbar>
            </AppBar>

            <main className={classes.content} style={{backgroundColor: '#F4F3F6', marginTop: 10, height: '100%'}}>
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
												setGenre={this.setGenre}
												followedGenres={this.state.followedGenres}
												handleFollowGenreClick={this.handleFollowGenreClick}
                      />}
                  />																	
									<Route
                    exact path='/good-podcasts'
                    render={(props) =>
                      <BestPodcastPage {...props}
												type={Constants.TYPE_GOOD}
                      />}
                  />
									<Route
                    exact path='/popular-podcasts'
                    render={(props) =>
                      <BestPodcastPage {...props}
												type={Constants.TYPE_POPULAR}
                      />}
                  />
									<Route
                    exact path='/best-podcasts-to-listen-to'
                    render={(props) =>
                      <BestPodcastPage {...props}
												type={Constants.TYPE_BEST}
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
												genre={this.state.currentGenre}
												showToast={this.showToast}
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
												genre={this.state.currentGenre}
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
                    path="/studio/:id"
                    render={(props) =>
											<ClipDetailsPage
	                      {...props}
												showToast={this.showToast}
	                    />}
                  />
									<Route
                    path="/genres"
                    render={(props) =>
											<GenresPage
	                      {...props}
												isLoggedIn={this.state.isLoggedIn}
												showToast={this.showToast}
	                    />}
                  />
									<Route
                    path="/g/:name"
                    render={(props) =>
											<FeedPage {...props}
												isLoggedIn={this.state.isLoggedIn}
												openLoginModal={this.openModal}
												showToast={this.showToast}
												setGenre={this.setGenre}
												followedGenres={this.state.followedGenres}
												handleFollowGenreClick={this.handleFollowGenreClick}
                      />}
                  />
									<Route
                    path="/playlist"
                    render={(props) =>
											<PlaylistPage
	                      {...props}
												isLoggedIn={this.state.isLoggedIn}
												showToast={this.showToast}
	                    />}
                  />
									<Route
                    path="/publishing"
                    render={(props) =>
											<PublishingPage
	                      {...props}
												isLoggedIn={this.state.isLoggedIn}
												showToast={this.showToast}
	                    />}
                  />
									<Route
                    path="/submit"
                    render={(props) =>
											<CreateClipPage
	                      {...props}
												isLoggedIn={this.state.isLoggedIn}
												showToast={this.showToast}
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
