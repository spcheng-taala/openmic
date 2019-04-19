import React from 'react';
import { Route, NavLink, BrowserRouter, Link,
  HashRouter, Switch, Redirect } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { Container, Row } from 'react-grid-system';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SvgIcon from '@material-ui/core/SvgIcon';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import { PlayButton, PrevButton, NextButton, Progress, Timer, VolumeControl } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import SoundPlayer from '../../ui/SoundPlayer.js';
import Notifications, {notify} from 'react-notify-toast';

import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';

import FeedPage from '../feed/FeedPage.js';
import AboutPage from '../about/AboutPage.js';
import DownloadPage from '../download/DownloadPage.js';
import StoryPage from '../story/StoryPage.js';
import ProfilePage from '../profile/ProfilePage.js';
import EditProfilePage from '../profile/EditProfilePage.js';
import DonationsPage from '../profile/DonationsPage.js';
import MessagesPage from '../profile/MessagesPage.js';
import PaymentsPage from '../payment/PaymentsPage.js';
import CheckoutPage from '../payment/CheckoutPage.js';
import TermsPage from '../about/TermsPage.js';
import PrivacyPolicyPage from '../about/PrivacyPolicyPage.js';
import ClipAudioPage from '../story/ClipAudioPage.js';
import TranscribePage from '../story/TranscribePage.js';
import ClipPage from '../clip/ClipPage.js';
import TwitterSharePage from '../clip/TwitterSharePage.js';

import SignUpModal from './components/SignUpModal.js';
import LoginModal from './components/LoginModal.js';
import UploadModal from './components/UploadModal.js';
import DonateModal from './components/DonateModal.js';
import WhyDonateModal from './components/WhyDonateModal.js';
import CheckoutModal from './components/CheckoutModal.js';
import ShareModal from './components/ShareModal.js';
import UploadSuccessModal from './components/UploadSuccessModal.js';
import MessageModal from './components/MessageModal.js';
import GoldCommentModal from './components/GoldCommentModal.js';
import ConfirmEmailModal from './components/ConfirmEmailModal.js';
import LoadingModal from './components/LoadingModal.js';

const drawerWidth = 240;

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
		background: 'rgba(255, 255, 255, 1)',
    transform: 'translate(-50%, -50%)'
  },
};

const drawerText = {
	color: 'white',
	fontFamily: 'Lato',
	fontSize: 20,
	fontWeight: 'bold',
  cursor: 'pointer',
}

const modalContainerStyle = {
	overflow: 'scroll',
}

const panelStyle = {
  backgroundColor : '#1D1D1E'
}

const logoStyle = {
  width: 30,
  height: 30,
	marginLeft: 10,
	cursor: "pointer",
}

const dateStyle = {
  fontFamily: "Lato",
  fontSize: 40,
  color: "#707070",
  fontWeight: "bold",
}

const destinationStyle = {
  color: "#808080",
  fontFamily: "Lato",
  fontSize: 25,
}

const timeStyle = {
  color: "#D2D2D2",
  fontFamily: "Lato",
  fontSize: 20,
}

const rightStyle = {
  paddingLeft: 40,
}

const fabContainerStyle = {
  float: "right",
  marginRight: 20,
  paddingBottom: 75,
}

const fabStyle = {
  backgroundColor: "#D14D85",
  float: "right",
  marginRight: 20,
}

const fabIconStyle = {
  width: 30,
  height: 30,
}

const heartFabStyle = {
  backgroundColor: "#D14D85",
  float: "right",
  marginRight: 20,
	width: 50,
	height: 50,
}


const heartIconStyle = {
	width: 50,
	height: 50,
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
  mediaText: {
    align: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: "Lato",
    fontSize: 30,
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
			UserManager.id = id;
			UserManager.firstName = localStorage.getItem('first_name');
			UserManager.lastName = localStorage.getItem('last_name');
			UserManager.username = localStorage.getItem('username');
			UserManager.email = localStorage.getItem('email');
			UserManager.profilePicture = localStorage.getItem('profile_picture');
			this.setState({
				firstName: UserManager.firstName,
				lastName: UserManager.lastName,
				username: UserManager.username,
				profilePicture: UserManager.profilePicture,
			});
			BackendManager.refreshToken = localStorage.getItem('refresh_token');
			BackendManager.updateToken().then(data => {
				// this.fetchPaymentSetup();
				this.fetchNotifications();
				this.fetchTotalDonations();
        this.fetchDonations();
				this.fetchMessages();
        this.fetchStripeAccount();
				this.fetchFollowing(UserManager.id);
				BackendManager.makeQuery('stories/following/count', JSON.stringify({
					user_id: UserManager.id,
				}))
		    .then(data => {
					if (data.success) {
						this.setState({
			        followingStoriesCount: data.count.count,
			      });
					}
		    });

		    BackendManager.makeQuery('stories/following', JSON.stringify({
					user_id: UserManager.id,
				}))
		    .then(data => {
					console.log(data);
					if (data.success) {
						this.setState({
			        followingStories: data.stories
			      });
					}
		    });
			});
		}

		BackendManager.makeQuery('public/stories/feed/count', JSON.stringify({}))
    .then(data => {
      UserManager.allStories = data.stories;
      this.setState({
        allStoriesCount: data.count.count,
      });
    });

    BackendManager.makeQuery('public/stories/feed', JSON.stringify({}))
    .then(data => {
      UserManager.allStories = data.stories;
      this.setState({
        allStories: data.stories
      });
    });
  }

  constructor(props) {
    super(props);

    this.state = {
			firstName: UserManager.firstName,
			lastName: UserManager.lastName,
			username: UserManager.username,
			profilePicture: UserManager.profilePicture,
			bio: UserManager.bio,
			hasPaymentSetup: false,
      modalIsOpen: false,
			uploadModalIsOpen: false,
			donateModalIsOpen: false,
      goldCommentModalIsOpen: false,
			shareModalIsOpen: false,
			whyDonateModalIsOpen: false,
			checkoutModalIsOpen: false,
			uploadSuccessModalIsOpen: false,
      messageModalIsOpen: false,
      confirmEmailModalIsOpen: false,
      loadingModalIsOpen: false,
      donateType: "dm",
			uploadedStoryId: 0,
			uploadedStoryTitle: "",
      isSignUp: true,
      isLoggedIn: false,
      signUpText: "Have an account? Login",
      playing: false,
      currentStory: UserManager.currentStory,
			emotes: {},
			allStoriesCount: 0,
      allStories: UserManager.allStories,
			followingStoriesCount: 0,
      followingStories: UserManager.followingStories,
			userStories: [],
			notifications: [],
			hasNewNotifications: false,
			user: null,
			totalListenedTo: 0,
			following: [],
			followers: [],
			totalDonations: 0,
			donations: [],
			commentDonations: [],
			messages: [],
      comments: [],
      currentMessageName: "",
      currentMessageEmail: "",
      currentMessageSenderId: 0,
			duration: 0,
			selectedFile: null,
			currentDonation: 0,
      currentDonationName: "",
      currentDonationEmail: "",
      currentDonationComment: "",
      currentParentCommentId: null,
      currentParentEmail: "",
      commentType: "comment",
      isPlaying: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
		this.openUploadModal = this.openUploadModal.bind(this);
		this.closeUploadModal = this.closeUploadModal.bind(this);
		this.openDonateModal = this.openDonateModal.bind(this);
		this.closeDonateModal = this.closeDonateModal.bind(this);
    this.openGoldCommentModal = this.openGoldCommentModal.bind(this);
    this.closeGoldCommentModal = this.closeGoldCommentModal.bind(this);
		this.openWhyDonateModal = this.openWhyDonateModal.bind(this);
		this.closeWhyDonateModal = this.closeWhyDonateModal.bind(this);
		this.openCheckoutModal = this.openCheckoutModal.bind(this);
		this.closeCheckoutModal = this.closeCheckoutModal.bind(this);
		this.finishCheckoutModal = this.finishCheckoutModal.bind(this);
		this.openShareModal = this.openShareModal.bind(this);
		this.closeShareModal = this.closeShareModal.bind(this);
		this.openUploadSuccessModal = this.openUploadSuccessModal.bind(this);
		this.closeUploadSuccessModal = this.closeUploadSuccessModal.bind(this);
    this.openMessageModal = this.openMessageModal.bind(this);
    this.closeMessageModal = this.closeMessageModal.bind(this);
    this.openConfirmEmailModal = this.openConfirmEmailModal.bind(this);
    this.closeConfirmEmailModal = this.closeConfirmEmailModal.bind(this);
    this.finishConfirmEmailModal = this.finishConfirmEmailModal.bind(this);
    this.openLoadingModal = this.openLoadingModal.bind(this);
    this.closeLoadingModal = this.closeLoadingModal.bind(this);
		this.renderShareModal = this.renderShareModal.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
    this.renderSoundPlayer = this.renderSoundPlayer.bind(this);
		this.renderAudio = this.renderAudio.bind(this);
		this.renderEditProfileDrawerPanel = this.renderEditProfileDrawerPanel.bind(this);
    this.renderDonationsDrawerPanel = this.renderDonationsDrawerPanel.bind(this);
		this.renderMessagesDrawerPanel = this.renderMessagesDrawerPanel.bind(this);
    this.renderLogoutDrawerPanel = this.renderLogoutDrawerPanel.bind(this);
    this.handleStoryClick = this.handleStoryClick.bind(this);
		this.handleUserClick = this.handleUserClick.bind(this);
		this.handleEmoteClick = this.handleEmoteClick.bind(this);
		this.fetchMoreAllStories = this.fetchMoreAllStories.bind(this);
		this.fetchMoreFollowingStories = this.fetchMoreFollowingStories.bind(this);
    this.fetchStory = this.fetchStory.bind(this);
		this.fetchUser = this.fetchUser.bind(this);
		this.playPreview = this.playPreview.bind(this);
    this.fetchStripeAccount = this.fetchStripeAccount.bind(this);
    this.handlePaymentSetup = this.handlePaymentSetup.bind(this);
		// this.fetchPaymentSetup = this.fetchPaymentSetup.bind(this);
		this.fetchTotalListenedTo = this.fetchTotalListenedTo.bind(this);
		this.fetchFollowing = this.fetchFollowing.bind(this);
		this.fetchFollowers = this.fetchFollowers.bind(this);
		this.fetchNotifications = this.fetchNotifications.bind(this);
		this.fetchTotalDonations = this.fetchTotalDonations.bind(this);
    this.fetchDonations = this.fetchDonations.bind(this);
		this.fetchMessages = this.fetchMessages.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
		this.handleFollowClick = this.handleFollowClick.bind(this);
		this.checkNewNotifications = this.checkNewNotifications.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.setDonation = this.setDonation.bind(this);
    this.setDonationName = this.setDonationName.bind(this);
    this.setDonationEmail = this.setDonationEmail.bind(this);
    this.setDonationComment = this.setDonationComment.bind(this);
		this.sendNote = this.sendNote.bind(this);
    this.showToast = this.showToast.bind(this);
    this.setParentComment = this.setParentComment.bind(this);
    this.setCommentType = this.setCommentType.bind(this);
    this.playPauseSound = this.playPauseSound.bind(this);
    this.logout = this.logout.bind(this);
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

	openDonateModal() {
    this.setState({
      donateType: "dm",
      donateModalIsOpen: true,
    });
  }

	closeDonateModal() {
    this.setState({
      donateModalIsOpen: false,
    });
  }

  openGoldCommentModal() {
    this.setState({
      donateType: "comment",
      goldCommentModalIsOpen: true,
    });
  }

  closeGoldCommentModal() {
    this.setState({
      goldCommentModalIsOpen: false,
    });
  }

	openWhyDonateModal() {
    this.setState({
			whyDonateModalIsOpen: true,
      donateModalIsOpen: false,
    });
  }

	closeWhyDonateModal() {
    this.setState({
			whyDonateModalIsOpen: false,
      donateModalIsOpen: true,
    });
  }

	openCheckoutModal() {
    this.setState({
      goldCommentModalIsOpen: false,
			checkoutModalIsOpen: true,
      donateModalIsOpen: false,
    });
  }

	closeCheckoutModal() {
    this.setState({
			checkoutModalIsOpen: false,
    });
  }

	finishCheckoutModal() {
		this.setState({
			checkoutModalIsOpen: false,
    });
	}

	openShareModal() {
    this.setState({
      shareModalIsOpen: true,
    });
  }

	closeShareModal() {
    this.setState({
      shareModalIsOpen: false,
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

  openMessageModal(name, email, senderId) {
		this.setState({
      currentMessageName: name,
      currentMessageEmail: email,
      currentMessageSenderId: senderId,
			messageModalIsOpen: true,
		});
	}

	closeMessageModal() {
		this.setState({
      currentMessage: null,
			messageModalIsOpen: false,
		});
	}

  openConfirmEmailModal(comment) {
    this.setState({
      confirmEmailModalIsOpen: true,
      currentDonationComment: comment,
    });
  }

  closeConfirmEmailModal() {
    this.setState({
      confirmEmailModalIsOpen: false,
      currentDonationComment: "",
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

  finishConfirmEmailModal() {
    this.setState({
      confirmEmailModalIsOpen: false,
      currentDonationComment: "",
    });
    notify.show("Sent!");
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

	renderShareModal() {
		if (this.state.currentStory != null) {
			return (
				<ShareModal shareUrl={"https://theopenmic.fm/#/story/"+this.state.currentStory.id}
				title={"Share this"}/>
			);
		}
	}

	renderAudio() {
		if (this.state.selectedFile != null) {
			return (
				<audio src={URL.createObjectURL(this.state.selectedFile)} onLoadedMetadata={this.handleMetadata}></audio>
			);
		}
	}

  renderSoundPlayer() {
		if (this.state.currentStory != null && this.state.currentStory.id > 0) {
			return (
	      <div className="p1 mt1 flex flex-center bg-darken-1 orange rounded">
	        <div className="flex-auto m0">
	          <h2 className="h3 text nowrap">{this.state.currentStory.title}</h2>
	          <h2 className="h5 text">{this.state.currentStory.first_name + " " + this.state.currentStory.last_name}</h2>
	        </div>
	        <Timer className="h6 text nowrap caps mt3 mr1" {...this.props} />
	      </div>
	    );
		}
  }

	renderEditProfileDrawerPanel() {
		if (this.state.isLoggedIn) {
			return (
				<div>
          <ListItem>
            <NavLink to="/edit" style={drawerText}>Edit Profile</NavLink>
          </ListItem>
				</div>
			);
		}
	}

  renderDonationsDrawerPanel() {
    if (this.state.isLoggedIn) {
      if (this.state.hasPaymentSetup) {
        return (
          <div>
            <ListItem>
              <NavLink to="/donations" style={drawerText}>My Donations</NavLink>
            </ListItem>
          </div>
        );
      } else {
        return (
          <div>
            <ListItem>
              <NavLink to="/payment/setup" style={drawerText}>Setup Payments</NavLink>
            </ListItem>
          </div>
        );
      }
    }
  }

	renderMessagesDrawerPanel() {
		if (this.state.isLoggedIn) {
			return (
				<div>
					<ListItem>
						<NavLink to="/messages" style={drawerText}>{"My Messages (New)"}</NavLink>
					</ListItem>
				</div>
			);
		}
	}

  renderLogoutDrawerPanel() {
    if (this.state.isLoggedIn) {
      return (
        <div>
          <ListItem>
            <h3 style={drawerText} onClick={() => this.logout()}>{"Log Out"}</h3>
          </ListItem>
        </div>
      )
    }
  }

	updateIndex() {
		this.setState({
			index: this.state.index + 1,
		});
	}

  handleStoryClick(storyId) {
		this.fetchStory(storyId);
  }

	fetchMoreAllStories(score) {
		BackendManager.makeQuery('public/stories/feed/cont', JSON.stringify({
      score: score,
    }))
    .then(data => {
      if (data.success) {
        var allStories = this.state.allStories;
				allStories = allStories.concat(data.stories);
				this.setState({
					allStories: allStories,
				});
      }
    });
	}

	fetchMoreFollowingStories(storyId) {
		BackendManager.makeQuery('stories/following/cont', JSON.stringify({
			user_id: UserManager.id,
      story_id: storyId,
    }))
    .then(data => {
      if (data.success) {
        var followingStories = this.state.followingStories;
				followingStories = followingStories.concat(data.stories);
				this.setState({
					followingStories: followingStories,
				});
      }
    });
	}

  fetchStory(id) {
		var needToStartOver = true;
		if (this.state.currentStory != null && this.state.currentStory.id == id) {
			needToStartOver = false;
		}
    BackendManager.makeQuery('public/stories/feed/story', JSON.stringify({
      story_id: id,
    }))
    .then(data => {
      if (data.success) {
        UserManager.currentStory = data.story;
        this.setState({
          currentStory: UserManager.currentStory
        });

        UserManager.currentStory = data.story;
        this.setState({currentStory: data.story, playing: true});
				this.fetchUser(data.story.user_id);
        this.fetchComments(data.story.id);
				this.fetchEmotes(data.story.id);
      }
    });
  }

	fetchEmotes(storyId) {
		BackendManager.makeQuery('public/stories/emotes', JSON.stringify({
      story_id: storyId,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					emotes: data.emotes,
				});
			}
    });
	}

	playPreview(story) {
		const { soundCloudAudio } = this.props;
		soundCloudAudio.stop();
		var streamUrl = story.url
		soundCloudAudio.play({ streamUrl })
		if (story.duration > 120) {
			soundCloudAudio.on('timeupdate', function() {
	      if (soundCloudAudio.audio.currentTime >= 120) {
	        soundCloudAudio.stop();
	      }
			})
		}
	}

  playPauseSound() {
    const { soundCloudAudio } = this.props;
    if (this.state.isPlaying) {
      soundCloudAudio.pause();
    } else {
      var streamUrl = this.state.currentStory.url
      soundCloudAudio.play({ streamUrl });
    }
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }

  fetchComments(id) {
    BackendManager.makeQuery('public/comments/story', JSON.stringify({
      story_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          comments: data.comments,
        });
      }
    });
  }

	handleUserClick(id, firstName, lastName, username, profilePicture, bio) {
		var user = {
			id: id,
			first_name: firstName,
			last_name: lastName,
			username: username,
			profile_picture: profilePicture,
			bio: bio,
		}
		this.setState({ user: user });
		BackendManager.makeQuery('public/stories/user', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          userStories: data.stories,
        });
      }

			this.fetchTotalListenedTo(id);
    });
	}

	handleEmoteClick(storyId, time) {
		var userId = null;
		if (this.state.isLoggedIn) {
			userId = UserManager.id;
		}
		BackendManager.makeQuery('public/stories/emote/create', JSON.stringify({
      story_id: storyId,
			user_id: UserManager.id,
			time: time,
    }))
    .then(data => {
      if (data.success) {

      }
    });
	}

	fetchUser(id) {
    BackendManager.makeQuery('users/basic', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					user: data.info,
        });
				this.handleUserClick(
					data.info.id,
					data.info.first_name,
					data.info.last_name,
					data.info.username,
					data.info.profile_picture,
					data.info.bio,
				);
      }
    });
  }

	fetchTotalListenedTo(id) {
    BackendManager.makeQuery('users/duration/total', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					totalListenedTo: data.total_duration,
        });
      }
    });
  }

	fetchFollowing(id) {
    BackendManager.makeQuery('users/following', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
			console.log(data);
      if (data.success) {
        this.setState({
					following: data.friends,
        });
      }
    });
  }

	fetchFollowers(id) {
    BackendManager.makeQuery('users/followers', JSON.stringify({
      user_id: id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					followers: data.friends,
        });
      }
    });
  }

	fetchNotifications() {
    BackendManager.makeQuery('notifications/', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					notifications: data.notifications,
        });
				this.checkNewNotifications();
      }
    });
  }

  fetchStripeAccount() {
    BackendManager.makeQuery('payments/account', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        if (data.account == 0) {
          this.setState({
            hasPaymentSetup: false,
          });
        } else {
          this.setState({
            hasPaymentSetup: true,
          });
        }
      }
    });
  }

  handlePaymentSetup(email, firstName, lastName, day, month, year) {
    BackendManager.makeQuery('payments/account/create', JSON.stringify({
      user_id: UserManager.id,
      email: email,
      first_name: firstName,
      last_name: lastName,
      day: day,
      month: month,
      year: year,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          hasPaymentSetup: true,
        });
        this.showToast("Done!");
      }
    });
  }

	fetchTotalDonations() {
		BackendManager.makeQuery('donations/total', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					totalDonations: this.state.totalDonations + data.total_donations,
        });
      }
    });

		BackendManager.makeQuery('comments/donations/total', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					totalDonations: this.state.totalDonations + data.total_donations,
        });
      }
    });
	}

  fetchDonations() {
    BackendManager.makeQuery('donations/donations', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					donations: data.donations,
        });
      }
    });
		BackendManager.makeQuery('comments/donations', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					commentDonations: data.comments,
        });
      }
    });
  }

	fetchMessages() {
		BackendManager.makeQuery('messages', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        this.setState({
					messages: data.messages,
        });
      }
    });
	}

	handleFollowClick(userId, profilePicture, firstName, lastName, bio, status) {
		BackendManager.makeQuery('friends/update/status', JSON.stringify({
      user_id: userId,
			friend_id: UserManager.id,
			status: status,
			first_name: UserManager.firstName,
			last_name: UserManager.lastName,
    }))
    .then(data => {
      if (data.success) {
				var following = this.state.following;
				if (status == 1) {
					following.push(
						{
							id: userId,
							first_name: firstName,
							last_name: lastName,
							bio: bio,
							profile_picture: profilePicture,
						}
					);
				} else {
					for (var i = 0; i < following.length; i++) {
						if (following[i].id == userId) {
							following.splice(i, 1);
						}
					}
				}
        this.setState({
					following: following,
        });
      }
    });
	}

	sendNote(message, email, name, donation) {
		if (this.state.isLoggedIn) {
			BackendManager.makeQuery('messages/new/ids', JSON.stringify({
	      sender_id: UserManager.id,
        sender_name: UserManager.firstName + " " + UserManager.lastName,
        sender_email: email,
				receiver_id: this.state.currentStory.user_id,
				message: message,
				donation: donation,
	    }))
	    .then(data => {
	      if (data.success) {
          this.showToast("Sent!");
	      }
	    });
		} else {
			BackendManager.makeQuery('notes/new/s/email', JSON.stringify({
	      sender_email: email,
        sender_name: name,
				receiver_id: this.state.currentStory.user_id,
				message: message,
				donation: donation
	    }))
	    .then(data => {
	      if (data.success) {
          this.showToast("Sent!");
	      }
	    });
		}
	}

	checkNewNotifications(id) {
    if (this.state.notifications.length > 0 && !this.state.notifications[0].seen) {
			this.setState({
				hasNewNotifications: true,
			});
		} else {
			this.setState({
				hasNewNotifications: false,
			});
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
    		var url = "https://s3-us-west-2.amazonaws.com/pokadotmedia/";
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`https://api.mypokadot.com/pp/upload/`, formData, {
        }).then(data => {
    			this.closeLoadingModal();
    			if (data.data.success) {
    				var storyUrl = url + data.data.title.split(' ').join('+');
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

	setDonation(donation) {
		this.setState({
			currentDonation: donation,
		});
	}

  setDonationName(name) {
    this.setState({
      currentDonationName: name,
    });
  }

  setDonationEmail(email) {
    this.setState({
      currentDonationEmail: email,
    });
  }

  setDonationComment(comment) {
    this.setState({
      currentDonationComment: comment,
    });
  }

  showToast(toast) {
    notify.show(toast);
  }

  setParentComment(parentCommentId, parentCommentEmail) {
    this.setState({
      currentParentCommentId: parentCommentId,
      currentParentEmail: parentCommentEmail,
    });
  }

  setCommentType(type) {
    this.setState({
      commentType: type
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
		const { soundCloudAudio } = this.props;
    const content = this.props.content;

    return (
      <BrowserRouter className={classes.main}>
        <div className={classes.main}>
					{this.renderAudio()}
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Sign Up"
          >
            {this.state.isSignUp ? <SignUpModal handleAuth={() => this.handleAuth()} closeModal={this.closeModal}/>
						: <LoginModal handleAuth={() => this.handleAuth()} closeModal={this.closeModal}/>}
            <button className="demo-link-red" onClick={this.toggleSignUp}>
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
            isOpen={this.state.donateModalIsOpen}
            onRequestClose={this.closeDonateModal}
            style={customStyles}
            contentLabel="Tip the creator!"
          >
            <DonateModal
							user={this.state.user}
							openWhyDonateModal={this.openWhyDonateModal}
							openCheckoutModal={this.openCheckoutModal}
							setDonation={this.setDonation}
              setDonationName={this.setDonationName}
							isLoggedIn={this.state.isLoggedIn}
							closeDonateModal={this.closeDonateModal}
							sendNote={this.sendNote}
              showToast={this.showToast}
						/>
          </Modal>
          <Modal
            isOpen={this.state.goldCommentModalIsOpen}
            onRequestClose={this.closeGoldCommentModal}
            style={customStyles}
            contentLabel="Gold Comment"
          >
            <GoldCommentModal
							user={this.state.user}
							openCheckoutModal={this.openCheckoutModal}
							setDonation={this.setDonation}
              setDonationName={this.setDonationName}
              setDonationEmail={this.setDonationEmail}
              setDonationComment={this.setDonationComment}
							isLoggedIn={this.state.isLoggedIn}
							closeGoldCommentModal={this.closeGoldCommentModal}
							sendNote={this.sendNote}
              showToast={this.showToast}
						/>
          </Modal>
					<Modal
            isOpen={this.state.whyDonateModalIsOpen}
            onRequestClose={this.closeWhyDonateModal}
            style={customStyles}
            contentLabel="Why Donate?"
          >
            <WhyDonateModal/>
          </Modal>
					<Modal
            isOpen={this.state.checkoutModalIsOpen}
            onRequestClose={this.closeCheckoutModal}
            style={customStyles}
            contentLabel="Checkout"
          >
            <CheckoutModal
              donateType={this.state.donateType}
							finishCheckoutModal={this.finishCheckoutModal}
							account={this.state.currentStory.stripe_account}
							amount={this.state.currentDonation}
              name={this.state.currentDonationName}
              email={this.state.currentDonationEmail}
              comment={this.state.currentDonationComment}
							userId={this.state.currentStory.user_id}
							isLoggedIn={this.state.isLoggedIn}
              currentStory={this.state.currentStory}
              showToast={this.showToast}
              fetchComments={this.fetchComments}
						/>
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
            isOpen={this.state.shareModalIsOpen}
            onRequestClose={this.closeShareModal}
            style={customStyles}
            contentLabel="Tip the creator!"
          >
						{this.renderShareModal()}
          </Modal>
          <Modal
            isOpen={this.state.messageModalIsOpen}
            onRequestClose={this.closeMessageModal}
            style={customStyles}
            contentLabel="Send a message"
          >
            <MessageModal
              name={this.state.currentMessageName}
              email={this.state.currentMessageEmail}
              receiverId={this.state.currentMessageSenderId}
              closeMessageModal={this.closeMessageModal}
              showToast={this.showToast}
            />
          </Modal>
          <Modal
            isOpen={this.state.confirmEmailModalIsOpen}
            onRequestClose={this.closeConfirmEmailModal}
            style={customStyles}
            contentLabel="Enter Email"
          >
            <ConfirmEmailModal
              currentStory={this.state.currentStory}
              comment={this.state.currentDonationComment}
              finishConfirmEmailModal={this.finishConfirmEmailModal}
              fetchComments={this.fetchComments}
              parentCommentId={this.state.currentParentCommentId}
              parentEmail={this.state.currentParentEmail}
              commentType={this.state.commentType}
            />
          </Modal>
          <Modal
            isOpen={this.state.loadingModalIsOpen}
            style={customStyles}
            contentLabel="Uploading..."
          >
            <LoadingModal/>
          </Modal>
          <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <NavLink exact to="/"><img style={logoStyle} src={"https://s3-us-west-2.amazonaws.com/pokadotmedia/icon_1024.png"} backgroundColor={'transparent'}/></NavLink>
                <NavLink exact to="/" className={classes.titleText}>OpenMic</NavLink>
                <NavLink to="/about" className={classes.flex}>About</NavLink>
								<a onClick={() => this.openUploadModal()}	className={classes.menuText}>Upload</a>
                {this.state.isLoggedIn ?
									<div>
										<NavLink to={"/profile/" + UserManager.id}>
											<img style={logoStyle} src={"../../../../../../images/profile.png"} backgroundColor={'transparent'}/>
										</NavLink>
									</div> :
                  <p className={classes.menuSignInText} onClick={() => this.openModal()}>Sign In</p>}
              </Toolbar>
            </AppBar>
						<Drawer
							className={classes.drawer}
		          variant="permanent"
		          classes={{
		            paper: classes.drawerPaper,
		          }}
		        >
		          <div className={classes.toolbar} />
		          <List>
              	{this.renderEditProfileDrawerPanel()}
                {this.renderDonationsDrawerPanel()}
								{this.renderMessagesDrawerPanel()}
								<ListItem>
									<NavLink to="/terms" style={drawerText}>Terms</NavLink>
								</ListItem>
								<ListItem>
									<NavLink to="/privacy" style={drawerText}>Privacy Policy</NavLink>
								</ListItem>
                {this.renderLogoutDrawerPanel()}
		          </List>
		        </Drawer>
            <main className={classes.content}>
              <div className={classes.toolbar} />
                <div className="content">
								<Switch>
                  <Route
                    exact path='/'
                    render={(props) =>
                      <FeedPage {...props}
												isLoggedIn={this.state.isLoggedIn}
												allStoriesCount={this.state.allStoriesCount}
                        allStories={this.state.allStories}
												followingStoriesCount={this.state.followingStoriesCount}
                        followingStories={this.state.followingStories}
												openLoginModal={this.openModal}
                        handleStoryClick={this.handleStoryClick}
												playPreview={this.playPreview}
												fetchMoreAllStories={this.fetchMoreAllStories}
												fetchMoreFollowingStories={this.fetchMoreFollowingStories}
                      />}
                  />
                  <Route path="/about" component={AboutPage}/>
                  <Route path="/download" component={DownloadPage}/>
									<Route path="/share/t" component={TwitterSharePage}/>
                  <Route
                    exact path='/payment/setup'
                    render={(props) =>
                      <PaymentsPage {...props}
                        handlePaymentSetup={this.handlePaymentSetup}
                      />}
                  />
									<Route path="/terms" component={TermsPage}/>
									<Route path="/privacy" component={PrivacyPolicyPage}/>
									<Route path="/checkout" component={CheckoutPage}/>
									<Route
										exact path='/clip'
										render={(props) =>
											<ClipAudioPage {...props}
												currentStory={this.state.currentStory}
												showToast={this.showToast}
											/>}
									/>
									<Route path="/transcribe" component={TranscribePage}/>
									<Route
                    exact path='/donations'
                    render={(props) =>
                      <DonationsPage {...props}
                        totalDonations={this.state.totalDonations}
                        donations={this.state.donations}
                        openMessageModal={this.openMessageModal}
                      />}
                  />
									<Route
                    exact path='/edit'
                    render={(props) =>
                      <EditProfilePage {...props}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
												username={this.state.username}
                        profilePicture={this.state.profilePicture}
												bio={this.state.bio}
                        showToast={this.showToast}
                      />}
                  />
                  <Route
                    exact path='/messages'
                    render={(props) =>
                      <MessagesPage {...props}
                        messages={this.state.messages}
                        fetchMessages={this.fetchMessages}
                        openMessageModal={this.openMessageModal}
                      />}
                  />
									<Route
                    path="/clips/:id"
                    render={(props) =>
                      <ClipPage {...props}/>}
                  />
                  <Route
                    path="/story/:id"
                    render={(props) =>
                      <StoryPage
                        {...props} handleStoryClick={this.handleStoryClick}
												soundCloudAudio={soundCloudAudio}
                        isLoggedIn={this.state.isLoggedIn}
                        currentStory={this.state.currentStory}
                        fetchStory={this.fetchStory}
                        comments={this.state.comments}
  											openLoginModal={this.openModal}
  											handleShareClick={this.openShareModal}
  											handleUserClick={this.handleUserClick}
  											handleDonateClick={this.openDonateModal}
                        openCheckoutModal={this.openCheckoutModal}
												handleFollowClick={this.handleFollowClick}
  											stories={this.state.userStories}
                        user={this.state.user}
  											fetchUser={this.fetchUser}
                        fetchComments={this.fetchComments}
                        openGoldCommentModal={this.openGoldCommentModal}
                        openConfirmEmailModal={this.openConfirmEmailModal}
                        showToast={this.showToast}
                        setParentComment={this.setParentComment}
                        setCommentType={this.setCommentType}
                        playPauseSound={this.playPauseSound}
												totalListenedTo={this.state.totalListenedTo}
                        isPlaying={this.state.isPlaying}
												following={this.state.following}
												emotes={this.state.emotes}
												handleEmoteClick={this.handleEmoteClick}
                      />}
                  />
                  <Route
                    path="/profile/:id"
                    render={(props) => <ProfilePage
                      {...props} handleStoryClick={this.handleStoryClick}
											stories={this.state.userStories}
                      user={this.state.user}
											fetchUser={this.fetchUser}
											totalListenedTo={this.state.totalListenedTo}
											following={this.state.following}
											followers={this.state.followers}
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

export default withStyles(styles)(withCustomAudio(MainPage));
