import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import BackendManager from '../../singletons/BackendManager.js';
import GenreItem from './components/GenreItem.js';
import InfiniteScroll from 'react-infinite-scroller';

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

class GenresPage extends Component {
  componentDidMount() {
    BackendManager.makeQuery('genres/all/count', JSON.stringify({
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          genreCount: data.count,
        });
        BackendManager.makeQuery('genres/all', JSON.stringify({
        }))
        .then(data => {
          if (data.success) {
            this.setState({
              genres: data.genres,
            });
          }
        });
      }
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
      genres: [],
      genreCount: 0,
      isMobile: false,
    };

    this.renderGenres = this.renderGenres.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.loadMoreGenres = this.loadMoreGenres.bind(this);
    this.handleGenreClick = this.handleGenreClick.bind(this);
  }

  renderListItem(item) {
    return (
      <div style={cardStyle}>
        <GenreItem
          isMobile={this.state.isMobile}
          genre={item}
          handleGenreClick={this.handleGenreClick}/>
      </div>
    );
  }

  loadMoreGenres() {
    if (this.state.genres.length > 0) {
      BackendManager.makeQuery('genres/all/cont', JSON.stringify({
        genre_id: this.state.genres[this.state.genres.length - 1].id,
      }))
      .then(data => {
        if (data.success) {
          var genres = this.state.genres;
          genres.push.apply(genres, data.genres);
          this.setState({
            genres: genres,
          });
        }
      });
    }
  }

  renderGenres() {
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMoreGenres}
          hasMore={this.state.genres.length < this.state.genreCount}
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <ul>
            {this.state.genres.map((item) => {
              return (this.renderListItem(item))
            })}
          </ul>
        </InfiniteScroll>
      </div>
    )
  }

  handleGenreClick(genre) {
    this.props.history.push('/g/' + encodeURIComponent(genre.name));
  }

  render() {
		return (
      <div style={{backgroundColor: '#F4F3F6', paddingBottom: 50}}>
        <Container>
          {this.renderGenres()}
        </Container>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(GenresPage));
