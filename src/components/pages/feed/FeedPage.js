import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroller';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Helmet } from 'react-helmet';
import BackendManager from '../../singletons/BackendManager.js';
import * as Constants from '../../singletons/Constants.js';
import ClipItem from './components/ClipItem.js';

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
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    if (this.props.match.params.name) {
      BackendManager.makeQuery('genres/check', JSON.stringify({
        name: decodeURIComponent(this.props.match.params.name)
      }))
      .then(data => {
        if (data.success && data.exists) {
          var genre = {
            value: data.genre,
            label: data.genre.name,
          };
          if (this._isMounted) {
            this.setState({
              genre: data.genre,
            });
            this.refreshClips(data.genre, this.state.clipType);
            this.props.setGenre(genre);
          }
        }
      });
    } else {
      this.setState({
        genre: {id: -1, name: 'All'}
      });
      var genre = {
        value: {id: -1, name: "All"},
        label: "All",
      };
      this.refreshClips({id: -1, name: 'All'}, this.state.clipType);
      this.props.setGenre(genre);
    }
    window.addEventListener('resize', this.resize, false);
    this.resize();
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.resize, false);
  }

  componentDidUpdate() {
    if (this.props.match.params.name && this.state.genre) {
      if (decodeURIComponent(this.props.match.params.name.toLowerCase()) !== this.state.genre.name.toLowerCase()) {
        BackendManager.makeQuery('genres/check', JSON.stringify({
          name: decodeURIComponent(this.props.match.params.name)
        }))
        .then(data => {
          if (data.success && data.exists && this._isMounted) {
            var genre = {
              value: data.genre,
              label: data.genre.name,
            };
            this.setState({
              genre: data.genre,
            });

            this.refreshClips(data.genre, this.state.clipType);
            this.props.setGenre(genre);
          }
        });
      }
    } else if (!this.props.match.params.name) {
      if (!this.state.genre || this.state.genre.id > 0) {
        this.setState({
          genre: {id: -1, name: 'All'}
        });
        var genre = {
          value: {id: -1, name: "All"},
          label: "All",
        };
        this.refreshClips({id: -1, name: 'All'}, this.state.clipType);
        this.props.setGenre(genre);
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
      genre: null,
      clipType: Constants.CLIP_TYPE_TRENDING,
      clipCount: 0,
      clips: [],
    };

    this.resize = this.resize.bind(this);
    this.renderHelmet = this.renderHelmet.bind(this);
    this.refreshClips = this.refreshClips.bind(this);
    this.getMoreClips = this.getMoreClips.bind(this);
    this.renderClipType = this.renderClipType.bind(this);
    this.setClipType = this.setClipType.bind(this);
    this.renderFeed = this.renderFeed.bind(this);
    this.renderSubscribeButton = this.renderSubscribeButton.bind(this);
    this.renderTopRightPanel = this.renderTopRightPanel.bind(this);
    this.renderRightPanel = this.renderRightPanel.bind(this);
    this.handleClipClick = this.handleClipClick.bind(this);
    this.handleCreateClipClick = this.handleCreateClipClick.bind(this);
  }

  renderHelmet() {
    if (this.props.match.params.name) {
      return (
        <Helmet>
          <title>{this.props.match.params.name + " - Riptide"}</title>
        </Helmet>
      );
    } else {
      return (
        <Helmet>
          <title>{"Riptide"}</title>
        </Helmet>
      );
    }
  }

  refreshClips(genre, clipType) {
    if (genre.id > 0) {
      BackendManager.makeQuery('clips/genre/count', JSON.stringify({
				genre_id: genre.id
			}))
			.then(data => {
				if (data.success && this._isMounted) {
					this.setState({
						clipCount: data.count,
					});
				}
			});

      if (clipType == Constants.CLIP_TYPE_TRENDING) {
        BackendManager.makeQuery('clips/genre/trending', JSON.stringify({
          genre_id: genre.id
        }))
        .then(data => {
          if (data.success && this._isMounted) {
            this.setState({
              clips: data.clips,
            });
          }
        });
      }	else {
        BackendManager.makeQuery('clips/genre/new', JSON.stringify({
          genre_id: genre.id
        }))
        .then(data => {
          if (data.success && this._isMounted) {
            this.setState({
              clips: data.clips,
            });
          }
        });
      }
    } else {
      BackendManager.makeQuery('clips/top/count', JSON.stringify({
  		}))
  		.then(data => {
  			if (data.success && this._isMounted) {
  				this.setState({
  					clipCount: data.count,
  				});
  			}
  		});

      if (clipType == Constants.CLIP_TYPE_TRENDING) {
        BackendManager.makeQuery('clips/top', JSON.stringify({
        }))
        .then(data => {
          if (data.success && this._isMounted) {
            this.setState({
              clips: data.clips,
            });
          }
        });
      } else {
        BackendManager.makeQuery('clips/new', JSON.stringify({
        }))
        .then(data => {
          if (data.success && this._isMounted) {
            this.setState({
              clips: data.clips,
            });
          }
        });
      }
    }
  }

  getMoreClips() {
    if (this.state.clips.length < this.state.clipCount) {
      if (this.state.clips.length > 0) {
        if (this.state.genre && this.state.genre.id > 0) {
    			if (this.state.clipType == Constants.CLIP_TYPE_TRENDING) {
    				BackendManager.makeQuery('clips/genre/trending/cont', JSON.stringify({
    					genre_id: this.state.genre.id,
    					score: this.state.clips[this.state.clips.length - 1].score,
    				}))
    				.then(data => {
    					if (data.success && this._isMounted) {
    						var clips = this.state.clips;
    						clips.push.apply(clips, data.clips);
    						this.setState({
    							clips: clips,
    						});
    					}
    				});
    			}	else {
    				BackendManager.makeQuery('clips/genre/new/cont', JSON.stringify({
    					genre_id: this.state.genre.id,
    					clip_id: this.state.clips[this.state.clips.length - 1].id,
    				}))
    				.then(data => {
    					if (data.success && this._isMounted) {
    						var clips = this.state.clips;
    						clips.push.apply(clips, data.clips);
    						this.setState({
    							clips: clips,
    						});
    					}
    				});
    			}
    		} else {
    			if (this.state.clipType == Constants.CLIP_TYPE_TRENDING) {
    				BackendManager.makeQuery('clips/top/cont', JSON.stringify({
    					score: this.state.clips[this.state.clips.length - 1].score,
    				}))
    				.then(data => {
    					if (data.success && this._isMounted) {
    						var clips = this.state.clips;
    						clips.push.apply(clips, data.clips);
    						this.setState({
    							clips: clips,
    						});
    					}
    				});
    			} else {
    				BackendManager.makeQuery('clips/new/cont', JSON.stringify({
    					clip_id: this.state.clips[this.state.clips.length - 1].id,
    				}))
    				.then(data => {
    					if (data.success && this._isMounted) {
    						var clips = this.state.clips;
    						clips.push.apply(clips, data.clips);
    						this.setState({
    							clips: clips,
    						});
    					}
    				});
    			}
    		}
      }
    }
  }

  handleClipClick(id) {
    this.props.history.push('/clips/' + id);
  }

  renderListItem(item) {
    return (
      <div key={item.uuid} style={{marginBottom: 30}}>
        <ClipItem
          isMobile={this.state.isMobile}
          id={item.uuid}
          url={item.url}
          title={item.title}
          thumbnail={item.podcast_thumbnail}
          podcast={item.podcast_title}
          name={item.username}
          duration={item.duration}
          likeCount={item.like_count}
          handleClipClick={this.handleClipClick} />
      </div>
    );
  }

  renderFeed() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.getMoreClips}
        hasMore={this.state.clips.length < this.state.clipCount}
        loader={<div className="loader" key={0}>Loading ...</div>}
      >
        <ul>
          {this.state.clips.map((item) => {
            return (this.renderListItem(item))
          })}
        </ul>
      </InfiniteScroll>
    );
  }

  renderSubscribeButton() {
    if (this.state.genre && this.state.genre.id > 0) {
      var hasGenre = false;
      for (var i = 0; i < this.props.followedGenres.length; i++) {
        if (this.props.followedGenres[i].id == this.state.genre.id) {
          hasGenre = true;
        }
      }
      if (hasGenre) {
        return (
          <button className='button-rounded-green-bordered' style={{marginTop: 20}} onClick={() => this.props.handleFollowGenreClick(this.state.genre)}>
            {"Unsubscribe"}
          </button>
        );
      } else {
        return (
          <button className='button-rounded-green' style={{marginTop: 20}} onClick={() => this.props.handleFollowGenreClick(this.state.genre)}>
            {"Subscribe"}
          </button>
        );
      }
    }
  }

  renderTopRightPanel() {
    if (this.state.genre && this.state.genre.id > 0) {
      return (
        <div style={{marginTop: 20, marginLeft: 20, width: 250, paddingBottom: 20}}>
          <Paper elevation={1} style={{backgroundColor: 'white'}}>
            <div>
              <div style={{paddingTop: 20}}/>
              <Typography style={textStyleBig}>
                {this.state.genre.name}
              </Typography>
              {this.renderSubscribeButton()}
              <div style={{paddingBottom: 20}}/>
            </div>
          </Paper>
        </div>
      );
    }
  }

  renderRightPanel() {
    return (
      <div style={{marginTop: 20, marginLeft: 20, width: 250, paddingBottom: 20}}>
        <Paper elevation={1} style={{backgroundColor: 'white'}}>
          <div>
            <img alt={"clip"} style={{margin: 10, width: 230}} src='../../../../../images/clip_bg.png'/>
            <Typography style={textStyleBig}>
              {"Be a part of the community!"}
            </Typography>
            <Typography style={textStyleSmall}>
              {"Create your own clips from your favorite podcasts and share it with others!"}
            </Typography>
            <button className='button-rounded-purple' onClick={() => this.handleCreateClipClick()}>
              {"Create Clip!"}
            </button>
            <div style={{paddingBottom: 30}}>
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  handleCreateClipClick() {
    if (this.props.isLoggedIn) {
      this.props.history.push('/submit');
    } else {
      this.props.openLoginModal();
    }
  }

  renderClipType() {
    if (this.state.clipType === Constants.CLIP_TYPE_TRENDING) {
      return (
        <Row>
          <p style={clipTypeActive} onClick={() => this.setClipType(Constants.CLIP_TYPE_TRENDING)}>
            {'Trending'}
          </p>
          <p style={clipTypeInactive} onClick={() => this.setClipType(Constants.CLIP_TYPE_NEW)}>
            {'New'}
          </p>
        </Row>
      );
    } else {
      return (
        <Row>
          <p style={clipTypeInactive} onClick={() => this.setClipType(Constants.CLIP_TYPE_TRENDING)}>
            {'Trending'}
          </p>
          <p style={clipTypeActive} onClick={() => this.setClipType(Constants.CLIP_TYPE_NEW)}>
            {'New'}
          </p>
        </Row>
      );
    }
  }

  setClipType(clipType) {
    this.setState({
      clipType: clipType
    });
    this.refreshClips(this.state.genre, clipType);
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={{backgroundColor: '#F4F3F6', paddingBottom: 50}}>
        {this.renderHelmet()}
        <Container>
          {this.renderClipType()}
          <Row>
            <Col md={8}>
              {this.renderFeed()}
            </Col>
            <Col md={4}>
              {this.renderTopRightPanel()}
              {this.renderRightPanel()}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default withRouter(FeedPage);
