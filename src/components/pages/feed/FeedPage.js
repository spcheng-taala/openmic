import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import * as Constants from '../../singletons/Constants.js';
import ClipItem from './components/ClipItem.js';

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: 'Lato',
  },
  textFieldLabelRoot: {
    fontFamily: 'Lato',
  }
});

const clipTypeActive = {
  marginTop: 10,
  width: 100,
  borderStyle: 'solid',
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#6175E0',
  backgroundColor: '#6175E0',
  textAlign: 'center',
  padding: 10,
  color: 'white',
  fontSize: 15,
  fontWeight: 'bold',
  cursor: 'pointer',
  marginLeft: 5,
}

const clipTypeInactive = {
  marginTop: 10,
  width: 100,
  borderStyle: 'solid',
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#6175E0',
  textAlign: 'center',
  padding: 10,
  color: '#6175E0',
  fontSize: 15,
  fontWeight: 'bold',
  cursor: 'pointer',
  marginLeft: 5,
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
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('scroll', this.onScroll, false);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
      if (this.props.clips.length < this.props.clipsCount) {
        if (this.props.clips[this.state.props.length - 1] != null) {
          this.props.getMoreClips();
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
      isMobile: false,
      recommendedPodcast: "",
    };

    this.renderClipType = this.renderClipType.bind(this);
    this.renderFeed = this.renderFeed.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderBottomRightPanel = this.renderBottomRightPanel.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
  }

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  renderListItem(item) {
    return (
      <div style={{marginBottom: 30}}>
        <ClipItem
          isMobile={this.state.isMobile}
          id={item.uuid}
          url={item.url}
          title={item.title}
          thumbnail={item.thumbnail_url}
          podcast={item.podcast_title}
          name={item.username}
          duration={item.duration}
          firstName={item.first_name}
          handleClipClick={this.handleClipClick} />
      </div>
    );
  }

  renderFeed() {
    return (
      <div>
        <ul>
          {this.props.clips.map((item) => {
            return (this.renderListItem(item))
          })}
        </ul>
      </div>
    )
  }

  renderRightPanel(classes) {
    return (
      <div style={{marginTop: 20, marginLeft: 20, width: 250}}>
        <Paper elevation={1} style={{backgroundColor: 'white'}}>
          <div>
            <img style={{margin: 10, width: 230}} src='../../../../../images/community_bg.png'/>
            <Typography style={textStyleBig}>
              {"Recommend a podcast!"}
            </Typography>
            <Typography style={textStyleSmall}>
              {"Is there a podcast that you love that you think other people should know? Tell us the name and we'll try to add it!"}
            </Typography>
            <div style={{margin: 10}}>
              <TextField
                id="outlined-adornment-amount"
                placeholder="Podcast Episode"
                fullWidth
                inputProps={{min: 0, style: { textAlign: 'center' }}}
                InputProps={{ classes: { root: classes.textFieldInputRoot } }}
                InputLabelProps={{
                  FormLabelClasses: {
                    root: classes.textFieldLabelRoot
                  }
                }}
                value={this.state.recommendedPodcast}/>
            </div>
            <div style={{paddingBottom: 10}}>
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  renderBottomRightPanel() {
    return (
      <div style={{marginTop: 20, marginLeft: 20, width: 250, paddingBottom: 20}}>
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

  renderClipType() {
    if (this.props.clipType == Constants.CLIP_TYPE_TRENDING) {
      return (
        <Row>
          <p style={clipTypeActive} onClick={() => this.props.setClipType(Constants.CLIP_TYPE_TRENDING)}>
            {'Trending'}
          </p>
          <p style={clipTypeInactive} onClick={() => this.props.setClipType(Constants.CLIP_TYPE_NEW)}>
            {'New'}
          </p>
        </Row>
      );
    } else {
      return (
        <Row>
          <p style={clipTypeInactive} onClick={() => this.props.setClipType(Constants.CLIP_TYPE_TRENDING)}>
            {'Trending'}
          </p>
          <p style={clipTypeActive} onClick={() => this.props.setClipType(Constants.CLIP_TYPE_NEW)}>
            {'New'}
          </p>
        </Row>
      );
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={{backgroundColor: '#F4F3F6', paddingBottom: 50}}>
        <Container>
          <Row>
            <Col md={8}>
              {this.renderClipType()}
              {this.renderFeed()}
            </Col>
            <Col md={4}>
              {this.renderRightPanel(classes)}
              {this.renderBottomRightPanel()}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(FeedPage));
