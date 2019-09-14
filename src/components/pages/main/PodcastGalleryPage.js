import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfiniteScroll from 'react-infinite-scroller';
import BackendManager from '../../singletons/BackendManager.js';
import queryString from 'query-string';

const styles = theme => ({
  root: {
    marginTop: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: '60%',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

class PodcastGalleryPage extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.setState({
      q: queryString.parse(this.props.location.search).q
    });
    BackendManager.searchPodcast(queryString.parse(this.props.location.search).q, 0)
    .then(data => {
      console.log(data);
      this.setState({
        offset: data.next_offset,
        podcasts: data.results,
        count: data.total,
      });
    });
  }

  componentDidUpdate() {
    if (queryString.parse(this.props.location.search).q !== this.state.q) {
      this.setState({
        q: queryString.parse(this.props.location.search).q,
      });
      BackendManager.searchPodcast(queryString.parse(this.props.location.search).q, 0)
      .then(data => {
        this.setState({
          offset: data.next_offset,
          podcasts: data.results,
          count: data.total,
        });
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize, false);
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
      q: '',
      offset: 0,
      podcasts: [],
      count: 0,
    };

    this.loadMorePodcasts = this.loadMorePodcasts.bind(this);
  }

  loadMorePodcasts() {
    BackendManager.searchPodcast(queryString.parse(this.props.location.search).q, this.state.offset)
    .then(data => {
      console.log(data);
      var podcasts = this.state.podcasts;
      podcasts.push.apply(podcasts, data.results);
      this.setState({
        offset: data.next_offset,
        podcasts: podcasts,
      });
    });
  }

  render() {
    const { classes } = this.props;
    var cols = 5;
    if (this.state.isMobile) {
      cols = 2;
    }
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMorePodcasts}
          hasMore={this.state.podcasts.length < this.state.count}
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList} cols={cols}>
              {this.state.podcasts.map(podcast => (
                <GridListTile key={podcast.id} style={{cursor: 'pointer'}} onClick={() => this.props.history.push('/episodes?q=' + podcast.id)}>
                  <img src={podcast.image} alt={podcast.title_original} />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default withStyles(styles)(PodcastGalleryPage);
