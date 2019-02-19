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

// some track meta information
const trackTitle = 'Immigration and the wall';

const tileData = [
    {
      index: 0,
      img: './images/laugh_emoji.png',
    },
    {
      index: 1,
      img: './images/thinking_emoji.png',
    },
 ];

var listStyle = {
  paddingRight: 40,
}

const iconStyle = {
  width: 50,
  cursor: 'pointer',
}

var indicatorShowStyle = {
  backgroundColor: 'grey',
  padding: 0,
  width: 50,
}

var indicatorHideStyle = {
  backgroundColor: '#FAFAFA',
  padding: 0,
  width: 50,
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
  fontSize: 30,
}

const mediaTextStyleSmall = {
  paddingLeft: 60,
  align: 'center',
  color: 'grey',
  fontFamily: "Lato",
  fontSize: 20,
}

const gridList = {
  width: 100,
  height: 70,
}

const indicatorList = {
  width: 100,
  height: 10,
}

const indicatorContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
}

const root = {
  paddingTop: 30,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
}

class FeedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 1,
      stories: this.props.seriousStories,
    };

    this.handleTypeClick = this.handleTypeClick.bind(this);
    this.renderFeed = this.renderFeed.bind(this);
    this.handleStoryClick = this.handleStoryClick.bind(this);
  }

  handleStoryClick(story) {
    this.props.history.push('/story/' + story.id);
    this.props.handleStoryClick(story.id);
  }

  handleTypeClick(index) {
    if (index == 0) {
      this.setState({stories: this.props.funnyStories, type: index})
    } else if (index == 1) {
      this.setState({stories: this.props.seriousStories, type: index})
    }
  }

  renderFeed() {
    if (this.state.type == 1)  {
      return (
        <div>
          <ul style={listStyle}>
              {this.props.seriousStories.map((item) => (
                <div style={cardStyle}>
                  <CardActionArea onClick={() => this.handleStoryClick(item)}>
                    <Paper style={mediaStyle} elevation={1}>
                      <div>
                        <Container>
                          <Row>
                          <Avatar alt={item.first_name + " " + item.last_name}
                            src={item.profile_picture} style={bigAvatar} />
                            <div>
                              <Typography style={mediaTextStyle}>
                                {item.title}
                              </Typography>
                              <Typography style={mediaTextStyleSmall}>
                                {item.first_name + " " + item.last_name}
                              </Typography>
                            </div>
                          </Row>
                        </Container>
                      </div>
                    </Paper>
                  </CardActionArea>
                </div>
              ))}
            </ul>
        </div>
      )
    } else if (this.state.type == 0) {
      return (
        <div>
          <ul style={listStyle}>
              {this.props.funnyStories.map((item) => (
                <div style={cardStyle}>
                  <CardActionArea onClick={() => this.handleStoryClick(item)}>
                    <Paper style={mediaStyle} elevation={1}>
                      <div>
                        <Container>
                          <Row>
                          <Avatar alt={item.first_name + " " + item.last_name}
                            src={item.profile_picture} style={bigAvatar} />
                            <div>
                              <Typography style={mediaTextStyle}>
                                {item.title}
                              </Typography>
                              <Typography style={mediaTextStyleSmall}>
                                {item.first_name + " " + item.last_name}
                              </Typography>
                            </div>
                          </Row>
                        </Container>
                      </div>
                    </Paper>
                  </CardActionArea>
                </div>
              ))}
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
                <img style={iconStyle} src={tile.img} alt={tile.title} />
              </GridListTile>
            ))}
          </GridList>
        </div>
        <div style={indicatorContainer}>
          <GridList cellHeight={5} style={indicatorList} cols={2}>
            {tileData.map(tile => (
              <div style={tile.index == this.state.type ? indicatorShowStyle:indicatorHideStyle} />
            ))}
          </GridList>
        </div>
        {this.renderFeed()}
      </div>
    )
  }
}

export default withRouter(FeedPage);
