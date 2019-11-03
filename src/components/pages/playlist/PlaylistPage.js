import React, { Component } from 'react';
import { Container, Row } from 'react-grid-system';
import { withRouter } from "react-router-dom";
import { Slider, Handles, Tracks } from 'react-compound-slider';
import ReactPlayer from 'react-player';
import Typography from '@material-ui/core/Typography';
import { Helmet } from 'react-helmet';
import UserManager from '../../singletons/UserManager.js';
import BackendManager from '../../singletons/BackendManager.js';
import UtilsManager from '../../singletons/UtilsManager.js';
import ClipItem from './components/ClipItem.js';
import InfiniteScroll from 'react-infinite-scroller';

const cardStyle = {
  marginBottom: 30,
}

const textStyleBig = {
  color: 'white',
  fontFamily: 'Lato',
  fontWeight: 800,
  fontSize: 19,
  margin: 5,
  textAlign: 'left',
}

const sliderStyle = {  // Give the slider some width
  position: 'relative',
  width: '100%',
  height: 60,
}

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: '#8B9CB6',
}

export function Handle({ // your handle component
  handle: { id, value, percent },
  getHandleProps
}) {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#2C4870',
        color: '#333',
      }}
      {...getHandleProps(id)}
    >
    </div>
  )
}

function Track({ source, target, getTrackProps }) { // your own track component
  return (
    <div
      style={{
        position: 'absolute',
        height: 10,
        zIndex: 1,
        marginTop: 35,
        backgroundColor: '#546C91',
        borderRadius: 5,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
    />
  )
}

class PlaylistPage extends Component {
  componentDidMount() {
    var id = localStorage.getItem('id');
		if (id != null) {
			var profilePicture = localStorage.getItem('profile_picture');
			var username = localStorage.getItem('username');
			UserManager.id = id;
			UserManager.username = username;
      BackendManager.makeQuery('podcasts/playlist/count', JSON.stringify({
        user_id: UserManager.id,
      }))
      .then(data => {
        if (data.success) {
          this.setState({
            podcastCount: data.count,
          });
          BackendManager.makeQuery('podcasts/playlist', JSON.stringify({
            user_id: UserManager.id,
          }))
          .then(data => {
            if (data.success) {
              this.setState({
                podcasts: data.podcasts,
              });
            }
          });
        }
      });
      window.addEventListener('resize', this.resize, false);
      this.resize();
		} else {
      this.props.history.push('/');
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
      podcasts: [],
      podcastCount: 0,
      isMobile: false,
      currentPodcast: null,
      isPlaying: false,
      value: 0,
      duration: 0,
    };

    this.resize = this.resize.bind(this);
    this.renderPlaylist = this.renderPlaylist.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.loadMoreEpisodes = this.loadMoreEpisodes.bind(this);
    this.handlePodcastClick = this.handlePodcastClick.bind(this);
    this.renderSlider = this.renderSlider.bind(this);
    this.handleSlideStart = this.handleSlideStart.bind(this);
		this.handleSlideEnd = this.handleSlideEnd.bind(this);
    this.handleVideoProgress = this.handleVideoProgress.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.renderProgressStr = this.renderProgressStr.bind(this);
    this.renderPlayer = this.renderPlayer.bind(this);
  }

  renderListItem(item) {
    return (
      <div key={item.id} style={cardStyle}>
        <ClipItem
          isMobile={this.state.isMobile}
          id={item.podcast_id}
          url={item.podcast_url}
          title={item.podcast_title}
          description={item.podcast_description}
          thumbnail={item.podcast_thumbnail}
          duration={item.podcast_duration}
          handlePodcastClick={this.handlePodcastClick}/>
      </div>
    );
  }

  loadMoreEpisodes() {
    BackendManager.makeQuery('podcasts/playlist/count', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        var podcasts = this.state.podcasts;
        podcasts.push.apply(podcasts, data.podcasts);
        this.setState({
          podcasts: podcasts,
        });
      }
    });
  }

  renderPlaylist() {
    if (this.state.podcasts.length > 0) {
      return (
        <div style={{marginBottom: 200}}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMoreEpisodes}
            hasMore={this.state.podcasts.length < this.state.podcastCount}
            loader={<div className="loader" key={0}>Loading ...</div>}
          >
            <ul>
              {this.state.podcasts.map((item) => {
                return (this.renderListItem(item))
              })}
            </ul>
          </InfiniteScroll>
        </div>
      );
    } else {
      return (
        <Container>
          <p style={{textAlign: 'center'}}>{"Nothing here yet :("}</p>
          <button className='button-rounded-green' onClick={() => this.props.history.push('/')}>
            {"Go Home"}
          </button>
        </Container>
      );
    }
  }

  ref = player => {
    this.player = player
  }

  handlePodcastClick(podcastId, podcastTitle, podcastThumbnail, podcastDuration, podcastUrl) {
    var podcast = {
      id: podcastId,
      title: podcastTitle,
      thumbnail: podcastThumbnail,
      duration: podcastDuration,
      url: podcastUrl,
    }
    this.setState({
      currentPodcast: podcast,
      isPlaying: true,
    });
  }

  renderSlider() {
		if (this.state.currentPodcast) {
			return (
				<div>
					<Slider
						rootStyle={sliderStyle}
						domain={[0, this.state.duration]}
						step={0.01}
						mode={1}
						onSlideStart={this.handleSlideStart}
						onSlideEnd={this.handleSlideEnd}
						values={[this.state.value]}
					>
						<div style={railStyle} />
						<Handles>
							{({ handles, getHandleProps }) => (
								<div className="slider-handles">
									{handles.map(handle => (
										<Handle
											key={handle.id}
											handle={handle}
											getHandleProps={getHandleProps}
										/>
									))}
								</div>
							)}
						</Handles>
						<Tracks left={false} right={false}>
							{({ tracks, getTrackProps }) => (
								<div className="slider-tracks">
									{tracks.map(({ id, source, target }) => (
										<Track
											key={id}
											source={source}
											target={target}
											getTrackProps={getTrackProps}
										/>
									))}
								</div>
							)}
						</Tracks>
					</Slider>
				</div>
			);
		}
	}

  handleSlideStart() {
		this.setState({
			isPlaying: false,
		});
	}

	handleSlideEnd(state) {
    if (this.state.currentPodcast) {
      if (state.length === 1) {
  			this.setState({
  				value: state[0],
  				isPlaying: true,
  			});
  		}

  		if (this.state.value < 1) {
  			var percentage = this.state.value / this.state.duration;
  			this.player.seekTo(percentage);
  		} else {
  			this.player.seekTo(this.state.value);
  		}
    }
	}

  handleVideoProgress(state) {
		this.setState({
			value: state.playedSeconds,
		});

    if (state.playedSeconds === this.state.duration) {
      this.setState({
        isPlaying: false,
        isFinished: true,
        value: 0,
      });
    }
  }

  handleDurationChange(duration) {
    this.setState({
      duration: duration,
    });
  }

  renderPlayPause() {
    var src = '../../../../../images/play_simple.png';
    if (this.state.isPlaying) {
      src = '../../../../../images/pause_simple.png';
    }
    return (
      <Row>
        <div style={{marginTop: 5, width: 50, height: 50, cursor: 'pointer', zIndex: 20}} onClick={() => this.togglePlayPause()}>
          <img
            alt={"play"}
            style={{width: 30, height: 30, cursor: 'pointer'}}
            src={src}
            />
        </div>
        {this.renderProgressStr()}
      </Row>
    );
  }

  togglePlayPause() {
    var isPlaying = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlaying,
    });
  }

	renderProgressStr() {
		return (
			<div>
				<p style={{color: 'white', fontSize: 15}}>{UtilsManager.createMinString(this.state.value) + " / " + UtilsManager.createMinString(this.state.duration)}</p>
			</div>
		);
	}

  renderPlayer() {
    if (this.state.currentPodcast) {
      var width = '70%';
  		if (this.state.isMobile) {
  			width = '50%';
  		}
      return (
        <div style={{position: 'fixed', left: 0, bottom: 0, right: 0}}>
          <div style={{marginTop: 20, height: 160, backgroundColor: '#232831'}}>
  					<div style={{display: 'inline-block', height: 160, width: 160}}>
  						<img alt={"thumbnail"} style={{height: 160, width: 160, objectFit: 'cover'}} src={this.state.currentPodcast.thumbnail}/>
  					</div>
  					<div style={{display: 'inline-block', marginLeft: 25, marginRight: 20, width: width}}>
  						<Typography style={textStyleBig}>
  							{this.state.currentPodcast.title}
  						</Typography>
  						{this.renderSlider()}
  						<div style={{padding: 5}}>
  							{this.renderPlayPause()}
  						</div>
  					</div>
          </div>
  				<div>
  					<ReactPlayer
  						ref={this.ref}
  						width={0}
  						height={0}
  						style={{display: 'hidden'}}
  						progressInterval={10}
  						url={this.state.currentPodcast.url}
  						onProgress={this.handleVideoProgress}
  						onDuration={this.handleDurationChange}
  						playing={this.state.isPlaying} />
  				</div>
        </div>
      );
    }
  }

  render() {
		return (
      <div>
        <div style={{backgroundColor: '#F4F3F6', paddingBottom: 50}}>
          <Helmet>
            <title>{"My Playlist - Riptide"}</title>
          </Helmet>
          <Container>
            {this.renderPlaylist()}
          </Container>
        </div>
        {this.renderPlayer()}
      </div>
    )
  }
}

export default withRouter(PlaylistPage);
