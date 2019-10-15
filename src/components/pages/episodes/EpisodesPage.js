import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
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

const cardStyle = {
  marginBottom: 30,
}

class EpisodesPage extends Component {
  componentDidMount() {
    BackendManager.getEpisodes(queryString.parse(this.props.location.search).q)
    .then(data => {
      console.log(data);
      this.setState({
        podcastId: data.id,
        podcastTitle: data.title,
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
      podcastId: "",
      podcastTitle: "",
      episodes: [],
      episodesCount: 0,
      nextPubDate: 0,
      isMobile: false,
    };

    this.renderHelmet = this.renderHelmet.bind(this);
    this.renderFeed = this.renderFeed.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.loadMoreEpisodes = this.loadMoreEpisodes.bind(this);
    this.handleEpisodeClick = this.handleEpisodeClick.bind(this);
  }

  renderHelmet() {
    return (
      <Helmet>
        <title>{this.state.podcastTitle  + " - Riptide"}</title>
      </Helmet>
    );
  }

  renderListItem(item) {
    return (
      <div style={cardStyle}>
        <ClipItem
          isMobile={this.state.isMobile}
          episode={item}
          id={item.id}
          url={item.audio}
          title={item.title}
          description={item.description}
          thumbnail={item.thumbnail}
          duration={item.audio_length_sec}
          handleEpisodeClick={this.handleEpisodeClick}/>
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
        {this.renderHelmet()}
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

  handleEpisodeClick(episode) {
    localStorage.setItem(episode.id, 'episode_id');
    localStorage.setItem(episode.description, 'episode_description');
    localStorage.setItem(episode.audio, 'episode_audio');
    localStorage.setItem(episode.image, 'episode_image');
    localStorage.setItem(episode.title, 'episode_title');
    localStorage.setItem(this.state.podcastTitle, 'episode_podcast_title');
    localStorage.setItem(this.state.podcastId, 'episode_podcast_id');
    localStorage.setItem(episode.audio_length_sec, 'episode_duration');
    window.open('/podcast/' + episode.id);
  }

  render() {
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
