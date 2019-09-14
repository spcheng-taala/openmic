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
import InfiniteScroll from 'react-infinite-scroller';
import queryString from 'query-string';

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

class EpisodesPage extends Component {
  componentDidMount() {
    BackendManager.getEpisodes(queryString.parse(this.props.location.search).q)
    .then(data => {
      console.log(data);
      this.setState({
        nextPubDate: data.next_episode_pub_date,
        episodes: data.episodes,
        episodesCount: data.total_episodes,
      });
    });

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this), false);
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
      episodes: [],
      episodesCount: 0,
      nextPubDate: 0,
      isMobile: false,
    };

    this.renderFeed = this.renderFeed.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.loadMoreEpisodes = this.loadMoreEpisodes.bind(this);
  }

  renderListItem(item) {
    return (
      <div style={cardStyle}>
        <ClipItem
          isMobile={this.state.isMobile}
          id={item.id}
          url={item.audio}
          title={item.title}
          description={item.description}
          thumbnail={item.thumbnail}
          duration={item.audio_length_sec}/>
      </div>
    );
  }

  loadMoreEpisodes() {
    BackendManager.getEpisodes(queryString.parse(this.props.location.search).q, this.state.nextPubDate)
    .then(data => {
      var episodes = this.state.episodes;
      episodes.push.apply(episodes, data.episodes);
      this.setState({
        nextPubDate: data.next_episode_pub_date,
        episodes: episodes,
      });
    });
  }

  renderFeed() {
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMoreEpisodes}
          hasMore={this.state.episodes.length < this.state.episodesCount}
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <ul>
            {this.state.episodes.map((item) => {
              return (this.renderListItem(item))
            })}
          </ul>
        </InfiniteScroll>
      </div>
    )
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={{backgroundColor: '#F4F3F6', paddingBottom: 50}}>
        <Container>
          {this.renderFeed()}
        </Container>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(EpisodesPage));
