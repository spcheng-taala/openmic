import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import DropdownAlert from 'react-native-dropdownalert';
import StateChecker from '../utils/StateChecker.js';
import EmptyButton from '../ui/buttons/EmptyButton.js';
import FilledButton from '../ui/buttons/FilledButton.js';
import BasicListItem from '../ui/list_items/BasicListItem.js';
import EventListItem from '../ui/list_items/EventListItem.js';
import BackendManager from '../../managers/BackendManager.js';
import PlanManager from '../../managers/PlanManager.js';
import EventManager from '../../managers/EventManager.js';
import UserManager from '../../managers/UserManager.js';
import Utils from '../../utils/Utils.js';

const GOING = 1;
const INVITED = 0;
const NOT_GOING = -1;
const PLAN = 5;

const width = '80%';
const height = '70%';

export default class EventsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      plans: PlanManager.plans,
      events: EventManager.events,
      nonReviewedEvents: [],
      nonReviewedFriends: [],
      nonReviewedTitle: "",
      nonReviewedIndex: 0,
      currentSendCount: 0,
      modalVisible: false,
      giftModalVisible: false,
      introModalVisible: UserManager.isFirstTime,
      currentUser: null,
      noteModalVisible: false,
      currentNote: "",
      startIndex: 0,
      introIndex: 0,
      introTexts: [
        "Nice! You just got 5 " + UserManager.firstName + " tokens!",
        "These tokens are unique to you!",
        "After a get-together is over, give a token to people that you want to see again!"
      ],
      introButtonTexts: [
        "Huh?",
        "Nice!",
        "Got it!",
      ],
      showGiftNotification: false,
    }
  }

  componentDidMount() {
    if (UserManager.currentSendCount > UserManager.sendCount) {
      UserManager.sendCount = UserManager.currentSendCount;
      this.showAlert();
    }
    this.refresh();
  }

  renderProfilePicture() {
    if (UserManager.profilePicture == null) {
      return (<FastImage style={styles.image} source={require('../../assets/images/profile.png')}/>)
    } else {
      return (<FastImage style={styles.circularImage} source={{uri: UserManager.profilePicture}}/>)
    }
  }

  refresh() {
    this.setState({refreshing: true});
    BackendManager.makeQuery('profiles/', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        UserManager.sendCount = data.profile.send_count;
        UserManager.currentSendCount = data.profile.send_count;
        this.setState({currentSendCount: data.profile.send_count});
      } else {
        console.log(data.error);
      }
    });
    BackendManager.makeQuery('plans/', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        var planArray = data.plans;
        var plans = [];
        for (var i = 0; i < planArray.length; i++) {
          var plan = planArray[i];
          if (plan.host.id == UserManager.id) {
            plan.title = "Your plan " + (i+1);
          } else {
            plan.title = plan.host.first_name + " " + plan.host.last_name + " wants you to help plan!";
          }
          plans.push(plan);
        }

        PlanManager.plans = plans;
        this.setState({plans: PlanManager.plans, refreshing: false});
      } else {
        console.log(data.error);
      }
    });
    BackendManager.makeQuery('events/', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        var events = data.events;
        for (var i = 0; i < events.length; i++) {
          events[i].status = this.getStatus(events[i].attendees);
          BackendManager.makeQuery('prompts/current', JSON.stringify({
            event_id: events[i].id,
          }))
          .then(data => {
            if (data.success) {
              if (data.prompt != null) {
                for (var i = 0; i < data.prompt.media.length; i++) {
                  Utils.download(data.prompt.media[i].url, data.prompt.media[i].id);
                }
              }
            } else {
              console.log(data.error);
            }
          });
          BackendManager.makeQuery('prompts/', JSON.stringify({
            event_id: events[i].id,
          }))
          .then(data => {
            if (data.success) {
              for (var i = 0; i < data.prompts.length; i++) {
                for (var j = 0; j < data.prompts[i].media.length; j++) {
                  Utils.download(data.prompts[i].media[j].url, data.prompts[i].media[j].id);
                }
              }
            } else {
              console.log(data.error);
            }
          });
        }

        this.setState({events: events, refreshing: false});
      } else {
        console.log(data.error);
      }
    });
    BackendManager.makeQuery('events/nonReviewed', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        if (data.events.length > 0) {
          this.setState({nonReviewedEvents: data.events,
            nonReviewedFriends: data.events[0].attendees,
            nonReviewedTitle: data.events[0].title,
            nonReviewedIndex: 0, refreshing: false});
          this.openModal();
        }
      } else {
        console.log(data.error);
      }
    });
    BackendManager.makeQuery('gifts/unseen', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        UserManager.gifts = data.gifts;
        if (data.gifts.length > 0) {
          this.setState({showGiftNotification: true});
        } else {
          this.setState({showGiftNotification: false});
        }
      } else {
        console.log(data.error);
      }
    });
    BackendManager.makeQuery('friends/', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        var requests = [];
        var friends = [];
        for (var i = 0; i < data.friends.length; i++) {
          if (data.friends[i].status == 1) {
            friends.push(data.friends[i]);
          } else {
            requests.push(data.friends[i]);
          }
        }
        UserManager.friends = friends;
        UserManager.requests = requests;
        this.setState({requests: UserManager.requests, friends: UserManager.friends});
      } else {
        console.log(data.error);
      }
    });
  }

  getStatus(attendees) {
    for (var i = 0; i < attendees.length; i++) {
      if (attendees[i].id == UserManager.id) {
        return attendees[i].status;
      }
    }
    return 0;
  }

  showAlert() {
    this.dropdown.alertWithType('custom', 'Ka-Ching!', 'You just earned 1 ' + UserManager.firstName + ' token!');
  }

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };
  // ...
  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  keyExtractor = (item, index) => item.id;

  onPressPlanItem = (id: int) => {
    var index = PlanManager.plans.findIndex(e => e.id == id);
    this.props.navigation.navigate('Plan', { currentPlan: PlanManager.plans[index] })
  };

  onPressEventItem = (id: int) => {
    var index = this.state.events.findIndex(e => e.id == id);
    this.props.navigation.navigate('Event', { currentEvent: this.state.events[index] })
  };

  renderPlanItem = ({item}) => (
    <EventListItem
      id={item.id}
      status={item.status}
      onPressItem={this.onPressPlanItem}
      name={item.title}/>
  );

  renderEventItem = ({item}) => (
    <EventListItem
      id={item.id}
      status={item.status}
      onPressItem={this.onPressEventItem}
      name={item.title}/>
  );

  onPressItem = (id: int) => {
    if (UserManager.currentSendCount > 0) {
      this.openGiftModal();
      this.closeModal();
      for (var i = 0; i < this.state.nonReviewedFriends.length; i++) {
        if (this.state.nonReviewedFriends[i].id == id) {
          this.setState({currentUser: this.state.nonReviewedFriends[i]});
        }
      }
    } else {
      alert("No more tokens :(");
    }
  };

  renderItem = ({item}) => (
    <BasicListItem
      id={item.id}
      onPressItem={this.onPressItem}
      title={item.first_name + " " + item.last_name}
      source={item.profile_picture == null ? require('../../assets/images/profile.png') : {uri: item.profile_picture}}/>
  );

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  nonReviewedDoneClicked() {
    BackendManager.makeQuery('events/reviewEvent/', JSON.stringify({
      event_id: this.state.nonReviewedEvents[this.state.nonReviewedIndex].id,
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
      } else {
        console.log(data.error);
      }
    });
    if (this.state.nonReviewedIndex < this.state.nonReviewedEvents.length - 1) {
      this.setState({nonReviewedFriends: this.state.nonReviewedEvents[this.state.nonReviewedIndex + 1].attendees,
        nonReviewedIndex: this.state.nonReviewedIndex+1,
        nonReviewedTitle: this.state.nonReviewedEvents[this.state.nonReviewedIndex + 1].title});
    } else {
      this.closeModal();
    }
  }

  openGiftModal() {
    this.setState({ giftModalVisible: true });
  }

  sendToken() {
    if (this.state.currentUser != null) {
      var note = null;
      if (this.state.currentNote != "") {
        note = this.state.currentNote;
      }
      BackendManager.makeQuery('gifts/create', JSON.stringify({
        giver_id: UserManager.id,
        receiver_id: this.state.currentUser.id,
        data: note,
      }))
      .then(data => {
        if (data.success) {
          UserManager.sendCount -= 1;
          UserManager.currentSendCount -= 1;
          for (var i = 0; i < this.state.nonReviewedFriends; i++) {
            if (this.state.currentUser.id == this.state.nonReviewedFriends[i].id) {
              this.state.nonReviewedFriends.splice(i, 1);
            }
          }
          this.setState({currentSendCount: UserManager.currentSendCount, nonReviewedFriends: this.state.nonReviewedFriends});
          this.closeGiftModal();
        } else {
          console.log(data.error);
        }
      });
    }
  }

  closeGiftModal() {
    this.openModal();
    this.setState({ giftModalVisible: false });
  }

  openNoteModal() {
    this.setState({ giftModalVisible: false, noteModalVisible: true });
  }

  closeNoteModal() {
    this.setState({ giftModalVisible: true, noteModalVisible: false });
  }

  renderIntroModalToken() {
    if (UserManager.profilePicture == null) {
      return (<FastImage style={styles.introModalToken} source={require('../../assets/images/profile.png')}/>)
    } else {
      return (<FastImage style={styles.introModalToken} source={{uri: UserManager.profilePicture}}/>)
    }
  }

  renderIntroButtonClicked() {
    if (this.state.introIndex < 2) {
      this.setState({introIndex: this.state.introIndex+=1});
    } else {
      UserManager.isFirstTime = false;
      this.setState({introModalVisible: false});
    }
  }

  renderIntroModal() {
    return (
      <Modal visible={this.state.introModalVisible} onRequestClose={() => this.closeModal()} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.introModalContainer}>
            <Text style={styles.introModalHeader}>Congratulations!</Text>
            <View style={styles.introModalBackground}>
              {this.renderIntroModalToken()}
            </View>
            <Text style={styles.introModalAmount}>5</Text>
            <Text style={styles.introModalTitle}>{this.state.introTexts[this.state.introIndex]}</Text>
            <View style={styles.modalButtonContainer}>
              <FilledButton title={this.state.introButtonTexts[this.state.introIndex]} onPress={this.renderIntroButtonClicked.bind(this)}/>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderSendTokenModal() {
    if (this.state.currentUser != null) {
      return (
        <Modal visible={this.state.giftModalVisible} onRequestClose={() => this.closeGiftModal()} transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.introModalContainer}>
              <TouchableOpacity style={styles.closeContainer} onPress={() => this.closeGiftModal()}>
                <Image style={styles.closeButton} source={require('../../assets/images/close_white.png')}/>
              </TouchableOpacity>
              <Text style={styles.introModalHeader}>{"Send " + this.state.currentUser.first_name + " a gift?"}</Text>
              <View style={styles.introModalBackground}>
                {this.renderIntroModalToken()}
              </View>
              <Text style={styles.introModalTitle}>{"This lets them know you want to see them again!"}</Text>
              <View style={styles.modalButtonContainer}>
                <FilledButton title={"Add Note"} color={'purple'} onPress={this.openNoteModal.bind(this)}/>
                <FilledButton title={"Done"} onPress={this.sendToken.bind(this)}/>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
  }

  renderNoteView() {
    if (this.state.currentUser != null) {
      return (
        <Modal visible={this.state.noteModalVisible} onRequestClose={() => this.closeNoteModal()} transparent={true}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalContainer}>
              <Text style={styles.tapText}>{"Tap here to dismiss keyboard"}</Text>
              <View style={styles.noteModalContainer}>
              <TextInput
                style={styles.inputText}
                multiline = {true}
                onChangeText={(text) => this.setState({currentNote: text})}
                value={this.state.currentNote}
                placeholderTextColor="white"
                placeholder={"Let's do this again!"}/>
                <View style={styles.modalButtonContainer}>
                  <FilledButton title={"Attach"} onPress={this.closeNoteModal.bind(this)}/>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.topButtonsContainer}>
            <Text style={styles.sendText}>{this.state.currentSendCount}</Text>
            <TouchableOpacity style={styles.topButtonView} onPress={() => this.props.navigation.navigate('Profile')}>
              {this.renderProfilePicture()}
            </TouchableOpacity>
            <TouchableOpacity style={styles.topButtonView} onPress={() => this.props.navigation.navigate('Gifts')}>
              <Image style={styles.image} source={this.state.showGiftNotification ? require('../../assets/images/gift_unread.png') : require('../../assets/images/gift.png')}/>
            </TouchableOpacity>
          </View>
        </View>
        <SectionList
          renderSectionHeader={({section}) => <Text style={styles.header}>{section.title}</Text>}
          sections={
            [
              {title: "My Plans", data: this.state.plans, keyExtractor: this.keyExtractor, renderItem: this.renderPlanItem},
              {title: "My Events", data: this.state.events, keyExtractor: this.keyExtractor, renderItem: this.renderEventItem},
            ]
          }
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
          }
        />
        <View style={styles.buttonContainer}>
          <FilledButton title={"Start a Plan!"} color={'purple'} onPress={() => this.props.navigation.navigate('PlanContributors', { selected: [] })}/>
        </View>
        <Modal visible={this.state.modalVisible} onRequestClose={() => this.closeModal()} transparent={true}>
          <View style={styles.modalContainer}>
            <Text style={styles.tapText}>{UserManager.currentSendCount + " " + UserManager.firstName + " tokens left!"}</Text>
            <View style={styles.modalInnerContainer}>
              <Text style={styles.modalTitle}>{"Select the people that made " + this.state.nonReviewedTitle + " special"}</Text>
              <FlatList
                style={styles.list}
                data={this.state.nonReviewedFriends}
                extraData={this.state}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
              />
              <View style={styles.modalButtonContainer}>
                <FilledButton title={"Done"} onPress={this.nonReviewedDoneClicked.bind(this)}/>
              </View>
            </View>
          </View>
        </Modal>
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          containerStyle={{
            backgroundColor: '#8A84E2',
          }}
          showCancel={true}
          onClose={data => this.onClose(data)}
          onCancel={data => this.onClose(data)}
          imageSrc={require('../../assets/images/coin.png')}
        />
        {this.renderIntroModal()}
        {this.renderSendTokenModal()}
        {this.renderNoteView()}        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    height: 70,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  topButtonView: {
    height: 50,
    width: 50,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 45,
    height: 45,
  },
  circularImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  sendText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Lato-Medium",
    color: '#E6C229',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10,
  },
  header: {
    marginLeft: 10,
    fontSize: 20,
    fontFamily: "Lato-Medium",
    color: '#52489C',
  },
  buttonContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  button: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,30,30,0.7)',
  },
  modalInnerContainer: {
    height,
    width,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: "Lato-Medium",
    color: '#52489C',
  },
  list: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  modalButtonContainer: {
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  giftModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  giftModalTopContainer: {
    marginTop: 20,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
  },
  introModalContainer: {
    height,
    width,
    borderRadius: 20,
    backgroundColor: '#FF3864',
  },
  introModalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introModalToken: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#FEDB32'
  },
  introModalHeader: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    fontSize: 30,
    fontFamily: "Lato-Medium",
    color: '#fff',
  },
  introModalAmount: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    fontSize: 50,
    fontFamily: "Lato-Medium",
    color: '#fff',
  },
  introModalTitle: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "Lato-Medium",
    color: '#fff',
  },
  closeContainer: {
    marginLeft: 10,
    marginTop: 10,
  },
  noteModalContainer: {
    height,
    width,
    borderRadius: 20,
    backgroundColor: '#FED995',
  },
  tapText: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: "Lato-Medium",
    color: '#fff',
  },
  inputText: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    color: '#000000',
    fontSize: 18,
    fontFamily: "Lato-Medium",
  },
});
