import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import ClipItem from './components/ClipItem.js';

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: 'Lato',
  },
  textFieldLabelRoot: {
    fontFamily: 'Lato',
  }
});

const textFieldStyle = {
  color: '#222225',
  marginTop: 10,
  marginLeft: 10,
  marginRight: 10,
}

const cardStyle = {
  marginBottom: 30,
}

const textStyleBig = {
  color: 'black',
  fontFamily: 'Lato',
  fontWeight: 800,
  fontSize: 19,
  margin: 5,
  textAlign: 'center',
}

const textStyleSmall = {
  color: '#B8B5BF',
  fontFamily: 'Lato',
  fontSize: 15,
  marginTop: 5,
  marginLeft: 10,
  marginRight: 10,
  textAlign: 'center',
  paddingBottom: 10,
}

class FeedPage extends Component {
  componentDidMount() {
    BackendManager.makeQuery('clips/all/count', JSON.stringify({
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          clipsCount: data.count,
        });
      }
    });

    BackendManager.makeQuery('clips/all', JSON.stringify({
    }))
    .then(data => {
      console.log(data);
      if (data.success) {
        this.setState({
          clips: data.clips,
        });
      }
    });

    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('scroll', this.onScroll, false);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
      if (this.state.clips.length < this.state.clipsCount) {
        if (this.state.clips[this.state.clips.length - 1] != null) {
          BackendManager.makeQuery('clips/all/cont', JSON.stringify({
            clip_id: this.state.clips[this.state.clips.length - 1].id,
          }))
          .then(data => {
            console.log(data);
            var clips = this.state.clips;
            clips.push.apply(clips, data.clips);
            if (data.success) {
              this.setState({
                clips: clips,
              });
            }
          });
        }
      }
    }
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
      clips: [],
      clipsCount: 0,
      isMobile: false,
      referralCode: "",
    };

    this.renderFeed = this.renderFeed.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderBottomRightPanel = this.renderBottomRightPanel.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
    this.renderFreeGems = this.renderFreeGems.bind(this);
    this.handleReferralChange = this.handleReferralChange.bind(this);
    this.handleReferralCodeClick = this.handleReferralCodeClick.bind(this);
  }

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  renderListItem(item) {
    if (this.state.isMobile) {
      return (
        <div style={cardStyle}>
          <ClipItem id={item.id} url={item.url} title={item.title} podcast={item.podcast_title} name={item.username} handleClipClick={this.handleClipClick} />
        </div>
      )
    } else {
      return (
        <div style={cardStyle}>
          <ClipItem id={item.id} url={item.url} title={item.title} podcast={item.podcast_title} name={item.username} handleClipClick={this.handleClipClick} />
        </div>
      )
    }
  }

  renderFeed() {
    return (
      <div>
        <ul>
          {this.state.clips.map((item) => {
            return (this.renderListItem(item))
          })}
        </ul>
      </div>
    )
  }

  renderRightPanel() {
    return (
      <div style={{marginTop: 20, marginLeft: 20, width: 250}}>
        <Paper elevation={1} style={{backgroundColor: 'white'}}>
          <div>
            <img style={{margin: 10, width: 230}} src='../../../../../images/community_bg.png'/>
            <Typography style={textStyleBig}>
              {"Join the OpenMic community!"}
            </Typography>
            <Typography style={textStyleSmall}>
              {"Interact with your favorite creators and their fans!"}
            </Typography>
            <button className='button-rounded-green' onClick={() => this.props.history.push('/community')}>
              {"Start Now!"}
            </button>
            <div style={{paddingBottom: 10}}>
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  renderBottomRightPanel() {
    return (
      <div style={{marginTop: 20, marginLeft: 20, width: 250}}>
        <Paper elevation={1} style={{backgroundColor: 'white'}}>
          <div>
            <img style={{margin: 10, width: 230}} src='../../../../../images/clip_bg.png'/>
            <Typography style={textStyleBig}>
              {"Be part of a fanbase!"}
            </Typography>
            <Typography style={textStyleSmall}>
              {"Create your own highlight clips from your favorite podcasts to interact and showcase with our creators and fans!"}
            </Typography>
            <button className='button-rounded-purple' onClick={() => this.props.history.push('/howitworks/clip')}>
              {"Learn More!"}
            </button>
            <div style={{paddingBottom: 30}}>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  handleReferralChange(e) {
    this.setState({
      referralCode: e.target.value
    });
  }

  handleReferralCodeClick() {
    if (this.props.isLoggedIn) {
      BackendManager.makeQuery('codes/check/code', JSON.stringify({
        name: this.state.referralCode,
      }))
      .then(data => {
        this.setState({
          referralCode: ""
        });
        if (data.success) {
          var code = data.code;
          BackendManager.makeQuery('codes/check/user', JSON.stringify({
            user_id: UserManager.id,
            code_id: code.id,
          }))
          .then(data => {
            if (data.success) {
              BackendManager.makeQuery('codes/count', JSON.stringify({
                code_id: code.id,
              }))
              .then(data => {
                if (data.success) {
                  if (code.limit > data.count) {
                    BackendManager.makeQuery('codes/user/add', JSON.stringify({
                      user_id: UserManager.id,
                      code_id: code.id
                    }))
                    .then(data => {
                      if (data.success) {
                        BackendManager.makeQuery('gems/user/update', JSON.stringify({
                          gem_count: code.amount,
                          user_id: UserManager.id
                        }))
                        .then(data => {
                          if (data.success) {
                            var text = "You just received " + code.amount + " Gems!";
                            this.props.openGemGifModal(code.amount, text);
                          }
                        });
                      }
                    });
                  } else {
                    this.props.showToast("This referral has expired :(", 'error');
                  }
                }
              });
            } else {
              this.props.showToast("Oops! Looks like you've already used this referral code", 'error');
            }
          });
        } else {
          this.props.showToast("Hmm, this referral code doesn't seem to exist", 'error');
        }
      });
    }
  }

  renderFreeGems(classes) {
    return (
      <div style={{marginTop: 20, marginLeft: 20, width: 250}}>
        <Paper elevation={1} style={{backgroundColor: 'white'}}>
          <div>
            <div style={{paddingTop: 10}}/>
            <Typography style={textStyleBig}>
              {"Enter a referral code!"}
            </Typography>
            <Typography style={textStyleSmall}>
              {"Have a referral code? Enter it here to get free gems!"}
            </Typography>
            <div style={{margin: 10}}>
              <TextField
                id="outlined-adornment-amount"
                placeholder="Enter Code"
                fullWidth
                inputProps={{min: 0, style: { textAlign: 'center' }}}
                InputProps={{ classes: { root: classes.textFieldInputRoot } }}
                InputLabelProps={{
                  FormLabelClasses: {
                    root: classes.textFieldLabelRoot
                  }
                }}
                value={this.state.referralCode}
                onChange={this.handleReferralChange} />
            </div>
            <button className='button-rounded-purple' onClick={() => this.handleReferralCodeClick()}>
              {"Done!"}
            </button>
            <div style={{paddingBottom: 10}}>
            </div>
          </div>
        </Paper>
      </div>
    )
  }


  render() {
    const { classes } = this.props;
		return (
      <div style={{backgroundColor: '#F4F3F6'}}>
        <Container>
          <Row>
            <Col md={8}>
              {this.renderFeed()}
            </Col>
            <Col md={4}>
              {this.renderFreeGems(classes)}
              {this.renderRightPanel()}
              {this.renderBottomRightPanel()}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(FeedPage));
