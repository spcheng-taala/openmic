import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Header from '../../ui/Header.js';
import MidTitle from '../../ui/MidTitle.js';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';

const tileData = [
    {
      index: 0,
      text: "Following",
    },
    {
      index: 1,
      text: "Followers",
    },
 ];

const listStyle = {
  paddingRight: 40,
}

const cardStyle = {
  marginBottom: 30,
}

const containerStyle = {
  position: "initial",
}

var paperStyle = {
  width: '100%',
  paddingTop: 50,
  paddingBottom: 50,
}

const root = {
  paddingTop: 30,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
}

const gridList = {
  width: 250,
  height: 80,
  overflowY: 'hidden',
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
  fontSize: 35,
}

const usernameStyle = {
  color: "#555555",
  font: "Lato",
  textAlign: "center",
  fontSize: 25,
}

const textStyle = {
  color: "#555555",
  font: "Lato",
  textAlign: "center",
  fontSize: 17,
}

const profileAvatar = {
  width: 150,
  height: 150,
  display: 'block',
  marginTop: 20,
  marginLeft: 'auto',
  marginRight: 'auto',
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

const countTextStyle = {
  textAlign: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 25,
}

const gridTextStyle = {
  textAlign: 'center',
  color: 'grey',
  fontFamily: "Lato",
  fontSize: 20,
}

class ProfilePage extends Component {

  componentDidMount() {
    this.props.fetchUser(this.props.match.params.id);
  }

  constructor(props) {
    super(props);

    this.state = {
      type: 1,
      stories: this.props.stories,
      user: this.props.user,
    };

    this.renderProfile = this.renderProfile.bind(this);
    this.renderFeed = this.renderFeed.bind(this);
    this.handleStoryClick = this.handleStoryClick.bind(this);
    this.getDurationStr = this.getDurationStr.bind(this);
  }

  renderProfile() {
    if (this.props.user != null) {
      return (
        <div>
          <h2 style={titleStyle}>{this.props.user.first_name + " " + this.props.user.last_name}</h2>
          <Avatar src={this.props.user.profile_picture} style={profileAvatar} />
          <h3 style={usernameStyle}>{"@" + this.props.user.username}</h3>
          <p style={textStyle}>{"Total time listened to:"}</p>
          <div className={"button-rounded-light"}>
            <p>{this.getDurationStr(this.props.totalListenedTo)}</p>
          </div>
          <p style={textStyle}>{this.props.user.bio}</p>
        </div>
      );
    }
  }

  handleStoryClick(story) {
    this.props.history.push('/story/' + story.id);
    this.props.handleStoryClick(story.id);
  }

  renderFeed() {
    return (
      <div>
        <ul style={listStyle}>
            {this.props.stories.map(item => (
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

  getDurationStr(totalDuration) {
    var totalSeconds = totalDuration;
    var years = Math.floor(totalSeconds/(3600 * 24 * 365));
    totalSeconds -= (years * 3600 * 24 * 365);
    var months = Math.floor(totalSeconds/(3600 * 24 * 30));
    totalSeconds -= (months * 3600 * 24 * 30);
    let days = Math.floor(totalSeconds/(3600 * 24))
    totalSeconds -= (days * 3600 * 24);
    let minutes = Math.floor(totalSeconds/60);
    totalSeconds -= (minutes * 60);
    var totalDurationStr = "";

    if (years > 0) {
        totalDurationStr = String(years) + "y ";
    }

    if (months > 0) {
        totalDurationStr += String(months) + "mo ";
    }

    if (days > 0) {
        totalDurationStr += String(days) + "d ";
    }

    if (minutes > 0) {
        totalDurationStr += String(minutes) + "min ";
    }

    totalDurationStr += String(totalSeconds) + "s";

    return totalDurationStr;
  }

  render() {
		return (
      <div>
        {this.renderProfile()}
        {this.renderFeed()}
      </div>
    )
  }
}

export default ProfilePage;
