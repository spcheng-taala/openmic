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
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Notifications, {notify} from 'react-notify-toast';

import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';

import FeedPage from '../feed/FeedPage.js';
import CommunityPage from '../about/CommunityPage.js';
import AboutPage from '../about/AboutPage.js';
import WhatAreGemsPage from '../about/WhatAreGemsPage.js';
import HowItWorksPage from '../about/HowItWorksPage.js';
import StoryPage from '../story/StoryPage.js';
import ProfilePage from '../profile/ProfilePage.js';
import EditProfilePage from '../profile/EditProfilePage.js';
import CheckOutPage from '../checkout/CheckOutPage.js';
import TermsPage from '../about/TermsPage.js';
import PrivacyPolicyPage from '../about/PrivacyPolicyPage.js';
import ClipAudioPage from '../story/ClipAudioPage.js';
import TranscribePage from '../story/TranscribePage.js';
import ClipPage from '../clip/ClipPage.js';
import EditClipPage from '../story/EditClipPage.js';
import TrimContentPage from '../story/TrimContentPage.js';
import CreateClipPage from '../story/CreateClipPage.js';
import EditorPage from '../story/EditorPage.js';
import PublishingPage from '../story/PublishingPage.js';
import ClipDetailsPage from '../story/ClipDetailsPage.js';
import MySponsorsPage from '../sponsor/MySponsorsPage.js';
import TwitterSharePage from '../clip/TwitterSharePage.js';

import SignUpModal from './components/SignUpModal.js';
import LoginModal from './components/LoginModal.js';
import UploadModal from './components/UploadModal.js';
import UploadSuccessModal from './components/UploadSuccessModal.js';
import LoadingModal from './components/LoadingModal.js';
import BuyGemsModal from './components/BuyGemsModal.js';
import ContributeGifAnimationModal from './components/ContributeGifAnimationModal.js';

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
		backgroundColor: '#FAFAFA',
	},

  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    backgroundColor: '#FAFAFA',
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
  card: {
    maxWidth: 745,
  },
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
			BackendManager.updateToken().then(data => {
				BackendManager.makeQuery('users/basic', JSON.stringify({
		      user_id: id,
		    }))
		    .then(data => {
		      if (data.success) {
		        this.setState({
							isCreator: data.is_creator,
		        });
		      }
		    });
				this.refreshFollowing();
				this.refreshGems();
				this.refreshDeals();
			});
		} else {
			var sponsorsJson = localStorage.getItem('sponsors');
			if (sponsorsJson) {
				this.setNotification(true);
			}
		}
  }

  constructor(props) {
    super(props);

    this.state = {
			hideDrawer: false,
      modalIsOpen: false,
			uploadModalIsOpen: false,
			uploadSuccessModalIsOpen: false,
      loadingModalIsOpen: false,
			buyGemsModalIsOpen: false,
			gemGifModalIsOpen: false,
			profilePicture: "",
			uploadedStoryId: 0,
			uploadedStoryTitle: "",
			following: [],
      isSignUp: true,
      isLoggedIn: false,
      signUpText: "Have an account? Login",
			isCreator: false,
			selectedFile: null,
			gems: 0,
			gemsAdded: 0,
			gemsText: "",
			seconds: 4,
			deals: [],
			showNotification: false,
    };

		this.timer = 0;

		this.refreshFollowing = this.refreshFollowing.bind(this);
		this.refreshGems = this.refreshGems.bind(this);
		this.refreshDeals = this.refreshDeals.bind(this);

		this.hideDrawer = this.hideDrawer.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
		this.openUploadModal = this.openUploadModal.bind(this);
		this.closeUploadModal = this.closeUploadModal.bind(this);
		this.openUploadSuccessModal = this.openUploadSuccessModal.bind(this);
		this.closeUploadSuccessModal = this.closeUploadSuccessModal.bind(this);
    this.openLoadingModal = this.openLoadingModal.bind(this);
    this.closeLoadingModal = this.closeLoadingModal.bind(this);
		this.openBuyGemsModal = this.openBuyGemsModal.bind(this);
		this.closeBuyGemsModal = this.closeBuyGemsModal.bind(this);
		this.openGemGifModal = this.openGemGifModal.bind(this);
		this.countDown = this.countDown.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
		this.setProfilePicture = this.setProfilePicture.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
		this.renderAudio = this.renderAudio.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
    this.showToast = this.showToast.bind(this);
		this.setNotification = this.setNotification.bind(this);
    this.logout = this.logout.bind(this);
		this.setFollowing = this.setFollowing.bind(this);
  }

	refreshFollowing() {
		BackendManager.makeQuery('followers/following', JSON.stringify({
			user_id: UserManager.id,
		}))
		.then(data => {
			if (data.success) {
				this.setState({
					following: data.following,
				});
			}
		});
	}

	refreshGems() {
		BackendManager.makeQuery('gems/user', JSON.stringify({
			user_id: UserManager.id,
		}))
		.then(data => {
			if (data.success) {
				if (data.gem_count < 0) {
					BackendManager.makeQuery('gems/user/create', JSON.stringify({
						user_id: UserManager.id,
						gem_count: 0,
					}))
					.then(data => {
						if (data.success) {
							this.setState({
								gems: 0,
							});
						}
					});
				} else {
					this.setState({
						gems: data.gem_count,
					});
				}
			}
		});
	}

	refreshDeals() {
		BackendManager.makeQuery('sponsors/user', JSON.stringify({
			user_id: UserManager.id,
		}))
		.then(data => {
			if (data.success) {
				if (data.sponsors.length > 0) {
					if (data.sponsors[0].viewed == 0) {
						this.setState({
							showNotification: true,
						});
					} else {
						this.setState({
							showNotification: false,
						});
					}
				} else {
					this.setState({
						showNotification: false,
					});
				}
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

	openUploadModal() {
    if (this.state.isLoggedIn) {
      this.setState({
        uploadModalIsOpen: true,
      });
    } else {
      this.openModal();
    }
  }

	closeUploadModal() {
    this.setState({
      uploadModalIsOpen: false,
    });
  }

	openUploadSuccessModal() {
		this.setState({
			uploadSuccessModalIsOpen: true
		});
	}

	closeUploadSuccessModal() {
		this.setState({
			uploadSuccessModalIsOpen: false
		});
	}

  openLoadingModal() {
    this.setState({
      loadingModalIsOpen: true
    });
  }

  closeLoadingModal() {
    this.setState({
      loadingModalIsOpen: false
    });
  }

	openBuyGemsModal() {
		this.setState({
			buyGemsModalIsOpen: true
		});
	}

	closeBuyGemsModal() {
		this.setState({
			buyGemsModalIsOpen: false
		});
	}

	openGemGifModal(gems, text) {
		this.setState({
			seconds: 4,
			gemsAdded: gems,
			gemsText: text,
			gemGifModalIsOpen: true,
		});
		this.timer = 0;
		if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
	}

	countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
			this.timer = 0;
			this.setState({
				gemGifModalIsOpen: false,
				seconds: 4,
			});
    }
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

	renderAudio() {
		if (this.state.selectedFile != null) {
			return (
				<audio src={URL.createObjectURL(this.state.selectedFile)} onLoadedMetadata={this.handleMetadata}></audio>
			);
		}
	}

	handleMetadata(e) {
    const duration = e.currentTarget.duration;
		alert(duration);
		this.setState({
			duration: duration,
		});
  }

	uploadFile(file, title, seconds) {
    if (this.state.isLoggedIn) {
      if (file != null) {
        this.openLoadingModal();
    		var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    		if (ext == "m4a") {
    			ext = "mp4";
    		}
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`https://api.mypokadot.com/pp/upload/`, formData, {
        }).then(data => {
    			this.closeLoadingModal();
    			if (data.data.success) {
    				var storyUrl = BackendManager.fileUrl + data.data.title.split(' ').join('+');
    				BackendManager.makeQuery('stories/create', JSON.stringify({
    					title: title,
    					url: storyUrl,
    					public: 1,
    					user_id: UserManager.id,
    					duration: seconds,
    				}))
    				.then(data => {
    					if (data.success) {
    						this.setState({
    							uploadedStoryId: data.id,
    							uploadedStoryTitle: title,
    						});
    						this.closeUploadModal();
    						this.openUploadSuccessModal();
    					}
    				});
    			}
        }).catch(error => {
          // handle your error
        });
      } else {
        alert("Oops! Looks like a file isn't attached! Make sure you select a file before uploading.");
      }
    } else {
      this.openModal();
    }

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

	setFollowing(isFollowing, userId) {
		var stage = 1;
		if (isFollowing) {
			stage = 0;
		}
		BackendManager.makeQuery('followers/update', JSON.stringify({
			follower_id: UserManager.id,
			user_id: userId,
			stage: stage,
		}))
		.then(data => {
			if (data.success) {
				this.refreshFollowing();
			}
		});
	}

  render() {
    const { classes } = this.props;
    const content = this.props.content;

    return (
      <BrowserRouter className={classes.main}>
        <div className={classes.main}>
					{this.renderAudio()}
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
					<Modal
            isOpen={this.state.uploadModalIsOpen}
            onRequestClose={this.closeUploadModal}
            style={customStyles}
            contentLabel="Upload a story"
          >
            <UploadModal uploadFile={this.uploadFile}/>
          </Modal>
					<Modal
            isOpen={this.state.uploadSuccessModalIsOpen}
            onRequestClose={this.closeUploadSuccessModal}
            style={customStyles}
            contentLabel="Upload Success"
          >
            <UploadSuccessModal
							storyId={this.state.uploadedStoryId}
							title={this.state.uploadedStoryTitle}
							closeUploadSuccessModal={this.closeUploadSuccessModal}
							handleStoryClick={this.handleStoryClick}
						/>
          </Modal>
          <Modal
            isOpen={this.state.loadingModalIsOpen}
            style={customStyles}
            contentLabel="Uploading..."
          >
            <LoadingModal/>
          </Modal>
					<Modal
            isOpen={this.state.buyGemsModalIsOpen}
						onRequestClose={this.closeBuyGemsModal}
            style={customStyles}
            contentLabel="Buy Gems"
          >
            <BuyGemsModal
							isLoggedIn={this.state.isLoggedIn}
							isMobile={this.state.isMobile}
							openLoginModal={this.openModal}
							closeBuyGemsModal={this.closeBuyGemsModal}
						/>
          </Modal>
					<Modal
            isOpen={this.state.gemGifModalIsOpen}
            style={customStylesLight}
            contentLabel="Woot!"
          >
            <ContributeGifAnimationModal
							gems={this.state.gemsAdded}
							text={this.state.gemsText}
						/>
          </Modal>
          <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <NavLink exact to="/"><img style={logoStyle} src={"https://s3-us-west-2.amazonaws.com/pokadotmedia/icon_1024.png"}/></NavLink>
                <NavLink exact to="/" className={classes.titleText}>Riptide</NavLink>
								<div className={classes.flex}/>
								{this.state.isLoggedIn ?
									<div style={{marginRight: 20}}>
										<p style={{color: '#FFFFFF', display: 'inline', marginRight: 5}}>{UtilsManager.convertToCommaString(this.state.gems)}</p>
										<img style={{width: 15, display: 'inline'}} src={"../../../../../../images/gem_3_10x.png"}/>
									</div>
									: <div/>
								}
								{this.state.isCreator ? <a onClick={() => this.openUploadModal()}	className={classes.menuText}>Upload</a> : <div/>}
								<img style={{width: 100, cursor: 'pointer'}} src={"../../../../../../images/get_gems.png"} onClick={() => this.openBuyGemsModal()}/>
								{this.state.showNotification ?
									<NavLink to={"/deals"}>
										<img style={{width: 25, cursor: 'pointer', marginLeft: 10}} src={"../../../../../../images/deals_notification.png"}/>
									</NavLink> :
									<NavLink to={"/deals"}>
										<img style={{width: 25, cursor: 'pointer', marginLeft: 10}} src={"../../../../../../images/deals.png"}/>
									</NavLink>
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

            <main className={classes.content}>
              <div className={classes.toolbar} />
                <div className="content">
								<Switch>
                  <Route
                    exact path='/'
                    render={(props) =>
                      <FeedPage {...props}
												isLoggedIn={this.state.isLoggedIn}
												openLoginModal={this.openModal}
												openGemGifModal={this.openGemGifModal}
												showToast={this.showToast}
                      />}
                  />
                  <Route path="/about" render={(props) =>
										<AboutPage {...props}
											hideDrawer={this.hideDrawer}
										/>}
									/>
									<Route path="/community" render={(props) =>
										<CommunityPage {...props}
											hideDrawer={this.hideDrawer}
										/>}
									/>
									<Route path="/howitworks/clip" render={(props) =>
										<HowItWorksPage {...props}
											hideDrawer={this.hideDrawer}
										/>}
									/>
									<Route path="/howitworks/gems" render={(props) =>
										<WhatAreGemsPage {...props}
											isLoggedIn={this.state.isLoggedIn}
											hideDrawer={this.hideDrawer}
											openLoginModal={this.openModal}
										/>}
									/>
									<Route path="/share/t"
										render={(props) =>
											<TwitterSharePage {...props}
												showToast={this.showToast}
											/>}
									/>
									<Route path="/terms" component={TermsPage}/>
									<Route path="/privacy" component={PrivacyPolicyPage}/>
									<Route
										exact path='/checkout'
										render={(props) =>
											<CheckOutPage {...props}
												openGemGifModal={this.openGemGifModal}
												refreshGems={this.refreshGems}
											/>
										}
									/>
									<Route
                    exact path='/edit'
                    render={(props) =>
                      <EditProfilePage {...props}
												isLoggedIn={this.state.isLoggedIn}
												setProfilePicture={this.setProfilePicture}
                        showToast={this.showToast}
												openGemGifModal={this.openGemGifModal}
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
												openBuyGemsModal={this.openBuyGemsModal}
												openGemGifModal={this.openGemGifModal}
												refreshGems={this.refreshGems}
											/>}
                  />
                  <Route
                    path="/story/:id"
                    render={(props) =>
                      <StoryPage
                        {...props}
                        isLoggedIn={this.state.isLoggedIn}
  											openLoginModal={this.openModal}
                        showToast={this.showToast}
												setNotification={this.setNotification}
												openBuyGemsModal={this.openBuyGemsModal}
												openGemGifModal={this.openGemGifModal}
												following={this.state.following}
												setFollowing={this.setFollowing}
												refreshGems={this.refreshGems}
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
                    path="/deals"
                    render={(props) =>
											<MySponsorsPage
	                      {...props}
												isLoggedIn={this.state.isLoggedIn}
												openLoginModal={this.openModal}
												setNotification={this.setNotification}
												showToast={this.showToast}
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
