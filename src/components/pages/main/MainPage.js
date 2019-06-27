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

const topClipText = {
	color: '#B8B5BF',
	fontFamily: 'Lato',
	fontSize: 17,
	marginLeft: 5,
	marginRight: 5,
  cursor: 'pointer',
}

const topClipSubMdText = {
	color: '#898395',
	fontFamily: 'Lato',
	fontSize: 14,
	marginBottom: 9,
	marginLeft: 5,
	marginRight: 5,
	marginTop: 5,
  cursor: 'pointer',
}

const topClipSubText = {
	color: '#898395',
	fontFamily: 'Lato',
	fontSize: 14,
	marginBottom: 9,
	marginLeft: 5,
	marginRight: 5,
  cursor: 'pointer',
}

const logoStyle = {
  width: 30,
  height: 30,
	marginLeft: 10,
	cursor: "pointer",
}

const followingPodcastStyleSmall = {
  color: '#868994',
  fontFamily: 'Lato',
  fontSize: 17,
  marginLeft: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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
			UserManager.id = id;
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
				this.fetchFollowing(UserManager.id);
			});
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
      isSignUp: true,
      isLoggedIn: false,
      signUpText: "Have an account? Login",
			following: [],
			followers: [],
			isCreator: false,
			selectedFile: null,
			gemsAdded: 0,
			gemsText: "",
			seconds: 5,
			topClips: [
				{
					id: 1,
					title: "Jessica Keeps Guests in Check",
					username: "houstondownes",
				},
				{
					id: 2,
					title: "Secret Agent Cerny",
					username: "imacoolpanda",
				},
				{
					id: 3,
					title: "Don't try to fight Russell Peters",
					username: "seanpcheng",
				},
				{
					id: 4,
					title: "Haddish House Hunting Method",
					username: "shrewdsheeple",
				},
				{
					id: 5,
					title: "Ask and you will receive",
					username: "houstondownes",
				},
			],
    };

		this.timer = 0;

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
    this.toggleSignUp = this.toggleSignUp.bind(this);
		this.renderAudio = this.renderAudio.bind(this);
		this.fetchFollowing = this.fetchFollowing.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
    this.showToast = this.showToast.bind(this);
    this.logout = this.logout.bind(this);
		this.renderTopLeftPanel = this.renderTopLeftPanel.bind(this);
		this.renderTopClipImg = this.renderTopClipImg.bind(this);
		this.renderTopClipListItem = this.renderTopClipListItem.bind(this);
		this.renderFollowingPodcasts = this.renderFollowingPodcasts.bind(this);
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
			gemsAdded: gems,
			gemsText: text,
			gemGifModalIsOpen: true,
		});
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
			this.setState({
				gemGifModalIsOpen: false,
				seconds: 5,
			});
    }
  }

  handleAuth() {
    this.setState({
      isLoggedIn: true,
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

	fetchFollowing(id) {
    BackendManager.makeQuery('users/following', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					following: data.friends,
        });
      }
    });
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
    notify.show(toast, type);
  }

  logout() {
    localStorage.clear();
    this.setState({
      isLoggedIn: false,
    });
  }

	renderTopClipImg(item, i) {
		if (i == 0) {
			return (
				<Row>
					<img style={{width: 70, height: 70, marginTop: -20, marginRight: -15}} src={"../../../../../images/gold-medal.svg"}/>
					<Typography style={topClipSubMdText}>
						{"by " + item.username}
					</Typography>
				</Row>
			);
		} else if (i == 1) {
			return (
				<Row>
					<img style={{width: 70, height: 70, marginTop: -20, marginRight: -15}} src={"../../../../../images/silver-medal.svg"}/>
					<Typography style={topClipSubMdText}>
						{"by " + item.username}
					</Typography>
				</Row>
			);
		} else if (i == 2) {
			return (
				<Row>
					<img style={{width: 70, height: 70, marginTop: -20, marginRight: -15}} src={"../../../../../images/bronze-medal.svg"}/>
					<Typography style={topClipSubMdText}>
						{"by " + item.username}
					</Typography>
				</Row>
			);
		} else {
			return (
				<Typography style={topClipSubText}>
					{"by " + item.username}
				</Typography>
			);
		}
	}

	renderTopClipListItem(item, i) {
		return (
			<div>
				<Typography className="lineClamp" style={topClipText}>
					{item.title}
				</Typography>
				{this.renderTopClipImg(item, i)}
			</div>
		);
	}

	renderFollowingPodcasts(item) {
		return (
			<div style={{marginBottom: 10}}>
				<Row>
					<Avatar src={item.profile_picture} style={{width: 30, height: 30, marginLeft: 10, display: 'inline-block'}} />
					<Typography style={followingPodcastStyleSmall}>
						{item.first_name}
					</Typography>
				</Row>
			</div>
		);
	}

	renderTopLeftPanel() {
		return (
			<div className='left-panel'>
				<div style={{margin: 10}}>
	        <Paper elevation={1} style={{backgroundColor: '#164747'}}>
	          <div>
	            <Typography style={panelTitleText}>
	              {"Weekly Leaderboard"}
	            </Typography>
							<div style={{margin: 5, height: 1, backgroundColor: '#1e6161'}}/>
							<ul style={{marginLeft: 5, padding: 0}}>
								{this.state.topClips.map((item, i) => {
									return (this.renderTopClipListItem(item, i))
								})}
							</ul>
	            <div style={{paddingBottom: 10}}>
	            </div>
	          </div>
	        </Paper>
					<div style={{marginTop: 10}}>
						<Typography style={panelTitleText}>
							{"Followed Podcasts"}
						</Typography>
						<div style={{margin: 5, height: 1, backgroundColor: '#1e6161'}}/>
						<ul style={{marginLeft: 5, padding: 0}}>
							{this.state.following.map((item) => {
								return (this.renderFollowingPodcasts(item))
							})}
						</ul>
					</div>
	      </div>
			</div>
		)
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
            {this.state.isSignUp ? <SignUpModal handleAuth={() => this.handleAuth()} closeModal={this.closeModal}/>
						: <LoginModal handleAuth={() => this.handleAuth()} closeModal={this.closeModal}/>}
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
                <NavLink exact to="/"><img style={logoStyle} src={"https://s3-us-west-2.amazonaws.com/pokadotmedia/icon_1024.png"} backgroundColor={'transparent'}/></NavLink>
                <NavLink exact to="/" className={classes.titleText}>OpenMic</NavLink>
                <NavLink to="/about" className={classes.flex}>About</NavLink>
								{this.state.isCreator ? <a onClick={() => this.openUploadModal()}	className={classes.menuText}>Upload</a> : <div/>}
								<img style={{width: 100, cursor: 'pointer'}} src={"../../../../../../images/get_gems.png"} backgroundColor={'transparent'} onClick={() => this.openBuyGemsModal()}/>
                {this.state.isLoggedIn ?
									<div>
										<NavLink to={"/profile/" + UserManager.id}>
											<Avatar style={logoStyle} src={"../../../../../../images/default_profile_picture_7.png"} backgroundColor={'transparent'}/>
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
										exact path='/clip'
										render={(props) =>
											<ClipAudioPage {...props}
												showToast={this.showToast}
											/>}
									/>
									<Route
										exact path='/checkout'
										render={(props) =>
											<CheckOutPage {...props}
												showToast={this.showToast}
												openGemGifModal={this.openGemGifModal}
											/>
										}
									/>
									<Route
										exact path='/editor/:id'
										render={(props) =>
											<EditClipPage {...props}
												showToast={this.showToast}
											/>
										}
									/>
									<Route path="/transcribe" component={TranscribePage}/>
									<Route
                    exact path='/edit'
                    render={(props) =>
                      <EditProfilePage {...props}
												isLoggedIn={this.state.isLoggedIn}
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
												openBuyGemsModal={this.openBuyGemsModal}
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
												openBuyGemsModal={this.openBuyGemsModal}
                      />}
                  />
                  <Route
                    path="/profile/:id"
                    render={(props) => <ProfilePage
                      {...props}
											logout={this.logout}
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
  content: PropTypes.element.isRequired
};

export default withStyles(styles)(MainPage);
