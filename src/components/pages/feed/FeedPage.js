import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import CardActionArea from '@material-ui/core/CardActionArea';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import BackendManager from '../../singletons/BackendManager.js'
import UserManager from '../../singletons/UserManager.js';
import CircularProgressbar from 'react-circular-progressbar';
import ClipItem from './components/ClipItem.js';

// some track meta information
const trackTitle = 'Immigration and the wall';

var listStyle = {
  width: '50%',
  margin: '0 auto'
}

const iconStyle = {
  width: 50,
  cursor: 'pointer',
}

var cardStyle = {
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

const root = {
  paddingTop: 30,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
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
      percentage: 0,
    };

    this.renderFeed = this.renderFeed.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.renderBottomRightPanel = this.renderBottomRightPanel.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
  }

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  handlePreviewClick(e, story) {
    e.stopPropagation();
    this.props.playPreview(story);
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
              {"Discover the best and funniest stories from our content creators!"}
            </Typography>
            <button className='button-rounded-green' onClick={() => this.props.history.push('/podcasts')}>
              {"View Shows!"}
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

  render() {
		return (
      <div style={{backgroundColor: '#F4F3F6'}}>
        <Container>
          <Row>
            <Col md={8}>
              {this.renderFeed()}
            </Col>
            <Col md={4}>
              {this.renderRightPanel()}
              {this.renderBottomRightPanel()}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withRouter(FeedPage);
