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
import UserManager from '../../singletons/UserManager.js';
import CircularProgressbar from 'react-circular-progressbar';

// some track meta information
const trackTitle = 'Immigration and the wall';

const tileData = [
    {
      index: 0,
      img: './images/laugh_emoji.png',
      title: "Feed",
    },
    {
      index: 1,
      img: './images/thinking_emoji.png',
      title: "Following",
    },
 ];

var listStyle = {
  paddingRight: 40,
}

const iconStyle = {
  width: 50,
  cursor: 'pointer',
}

var active = {
  color: '#CF5085',
  fontWeight: 'bold',
}

var inactive = {
  color: 'grey',
  fontWeight: 'normal',
}

var cardStyle = {
  marginBottom: 30,
}

var containerStyle = {
  marginLeft: 20,
  marginTop: 20,
  marginBottom: 300,
}

const bigAvatar = {
  width: 80,
  height: 80,
  marginLeft: 20,
}

const mediaStyle = {
  width: '100%',
  paddingTop: 50,
  paddingBottom: 50,
  backgroundColor: '#FFFFFF'
}

const mediaTextStyle = {
  paddingLeft: 60,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  flex: 1,
  fontSize: 30,
}

const mediaTextStyleMobile = {
  color: '#36454f',
  fontFamily: "Lato",
  flex: 1,
  fontSize: 30,
  textAlign: 'center',
}

const mediaTextStyleSmall = {
  paddingLeft: 60,
  align: 'center',
  color: 'grey',
  fontFamily: "Lato",
  fontSize: 20,
}

const mediaTextStyleSmallMobile = {
  color: 'grey',
  fontFamily: "Lato",
  fontSize: 20,
  textAlign: 'center',
}

const gridList = {
  width: 145,
  height: 70,
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
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener('scroll', this.onScroll, false);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
      if (this.state.type == 0) {
        if (this.props.allStories.length < this.props.allStoriesCount) {
          this.props.fetchMoreAllStories(this.props.allStories[this.props.allStories.length - 1].score);
        }
      } else {
        if (this.props.followingStories.length < this.props.followingStoriesCount) {
          this.props.fetchMoreFollowingStories(this.props.followingStories[this.props.followingStories.length - 1].id);
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
      type: 0,
      percentage: 0,
    };

    this.handleTypeClick = this.handleTypeClick.bind(this);
    this.renderFeed = this.renderFeed.bind(this);
    this.handleStoryClick = this.handleStoryClick.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
  }

  handleStoryClick(story) {
    this.props.history.push('/story/' + story.id);    
    this.props.handleStoryClick(story.id);
  }

  handleTypeClick(index) {
    if (index == 0) {
      this.setState({type: index})
    } else if (index == 1) {
      if (this.props.isLoggedIn) {
        this.setState({type: index});
      } else {
        this.props.openLoginModal();
      }
    }
  }

  handlePreviewClick(e, story) {
    e.stopPropagation();
    this.props.playPreview(story);
  }

  renderListItem(item) {
    if (this.state.isMobile) {
      return (
        <div style={cardStyle}>
          <CardActionArea onClick={() => this.handleStoryClick(item)}>
            <Paper style={mediaStyle} elevation={1}>
              <div>
                <Container>
                  <div style={{width: '100%', textAlign: 'center'}}>
                    <img className="center-cropped" style={{display: 'inline-block', marginBottom: 20}} src={item.profile_picture}/>
                  </div>
                  <div>
                    <Typography style={mediaTextStyleMobile}>
                      {item.title}
                    </Typography>
                    <Typography style={mediaTextStyleSmallMobile}>
                      {item.first_name + " " + item.last_name}
                    </Typography>
                    <Row>
                      <button className='button-preview' onClick={(e) => this.handlePreviewClick(e, item)}>
                        {"Play Preview"}
                      </button>
                    </Row>
                  </div>
                </Container>
              </div>
            </Paper>
          </CardActionArea>
        </div>
      )
    } else {
      return (
        <div style={cardStyle}>
          <CardActionArea onClick={() => this.handleStoryClick(item)}>
            <Paper style={mediaStyle} elevation={1}>
              <div>
                <Container>
                  <Row>
                    <img className="center-cropped" src={item.profile_picture}/>
                    <Col>
                      <div>
                        <Typography style={mediaTextStyle}>
                          {item.title}
                        </Typography>
                        <Typography style={mediaTextStyleSmall}>
                          {item.first_name + " " + item.last_name}
                        </Typography>
                        <Row>
                          <button className='button-preview' onClick={(e) => this.handlePreviewClick(e, item)}>
                            {"Play Preview"}
                          </button>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Paper>
          </CardActionArea>
        </div>
      )
    }
  }

  renderFeed() {
    if (this.state.type == 1)  {
      return (
        <div>
          <ul style={listStyle}>
              {this.props.followingStories.map((item) => {
                return (this.renderListItem(item))
              })}
            </ul>
        </div>
      )
    } else if (this.state.type == 0) {
      return (
        <div>
          <ul style={listStyle}>
              {this.props.allStories.map((item) => {
                return (this.renderListItem(item))
              })}
            </ul>
        </div>
      )
    }
  }

  render() {
		return (
      <div>
        <div style={root}>
          <GridList cellHeight={50} style={gridList} cols={2}>
            {tileData.map(tile => (
              <GridListTile key={tile.img} onClick={() => this.handleTypeClick(tile.index)}>
                <p style={tile.index == this.state.type ? active:inactive}>{tile.title}</p>
              </GridListTile>
            ))}
          </GridList>
        </div>
        {this.renderFeed()}
      </div>
    )
  }
}

export default withRouter(FeedPage);
