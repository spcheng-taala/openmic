import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import ClipItem from './components/ClipItem.js';
import BackendManager from '../../singletons/BackendManager.js';
import * as Constants from '../../singletons/Constants.js';

const TITLE_BEST_PODCAST = "Some of the best podcasts to listen to";
const TITLE_POPULAR_PODCASTS = "Popular Podcasts";
const TITLE_GOOD_PODCAST = "Some of our favorite podcasts";

const DETAILS_BEST_PODCAST = "Whether you're just getting into podcasts or are a season veteran, there are always amazing podcasts out there that are just waiting to be discovered! Here are clips from some of our favorites!";
const DETAILS_POPULAR_PODCASTS = "Whether you're just getting into podcasts or are a season veteran, there are always amazing podcasts out there that are just waiting to be discovered! Here are the trending clips right now!"
const DETAILS_GOOD_PODCASTS = "With the countless podcasts out there, millions of episodes, not to mention the many many podcast apps out there, finding a good starting point can seem very intimidating. Not to fret though! We've collected some of our favorite podcasts and some clips just to give you a sample of the wide and amazing world you're about to enter!";

 const text = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 20,
   textAlign: 'left',
   marginBottom: 10,
 }

 const titleText = {
   color: '#4E5CD8',
   fontFamily: 'Lato',
   fontSize: 30,
   fontWeight: 'bold',
   marginBottom: 10,
 }

 const descText = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 17,
   marginTop: 10,
 }

 const sectionTitleText = {
   color: '#4E5CD8',
   fontFamily: 'Lato',
   fontSize: 20,
 }

 const sectionText = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 17,
   margin: 10,
 }

class BestPodcastPage extends Component {

  componentDidMount() {
    if (this.props.type == Constants.TYPE_BEST) {
      this.setState({
        title: TITLE_BEST_PODCAST,
        details: DETAILS_BEST_PODCAST,
      });
    } else if (this.props.type == Constants.TYPE_POPULAR) {
      this.setState({
        title: TITLE_POPULAR_PODCASTS,
        details: DETAILS_POPULAR_PODCASTS,
      });
    } else if (this.props.type == Constants.TYPE_GOOD) {
      this.setState({
        title: TITLE_GOOD_PODCAST,
        details: DETAILS_GOOD_PODCASTS,
      });
    }

    BackendManager.makeQuery('clips/top/10', JSON.stringify({
    }))
    .then(data => {
      if (data.success) {
        this.setState({
          clips: data.clips,
        });
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      clips: [],
      title: TITLE_BEST_PODCAST,
      details: DETAILS_BEST_PODCAST,
    };
    this.renderListItem = this.renderListItem.bind(this);
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

  render() {
    const { classes } = this.props;
		return (
      <div>
        <div className="landing-page">
          <Container>
            <h1 style={{textAlign: 'left', fontSize: 30, color: '#3ABBBC', marginTop: 40}}>{this.state.title}</h1>
            <p style={text}>{this.state.details}</p>
          </Container>
          <Container style={{marginTop: 20}}>
            <ul>
              {this.state.clips.map((item) => {
                return (this.renderListItem(item))
              })}
            </ul>
          </Container>
        </div>
        <Container>
          <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"It's more than just listening"}</h1>
          <p style={text}>{"Welcome to Riptide! We are a home for podcasters and their fans. Whether you're looking to find new content to listen to, create and share a highlight, or just want to be a part of a community to laugh and have fun with, you'll find it here. With clipping and comments, you don't just listen to podcasts, you're a part of the experience."}</p>
        </Container>
        <Container>
          <h1 style={{textAlign: 'center', fontSize: 30, color: '#3ABBBC', marginTop: 100}}>{"Be a part of our community!"}</h1>
          <p style={text}>{"Discovering good podcasts is hard. You don't need to be a podcaster to be a part of our community! In fact most of the content is created by our listeners."}</p>
          <Row>
            <Col lg={4}>
              <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                <Row>
                  <Col md={3}>
                    <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/record_green.png" />
                  </Col>
                  <p style={sectionTitleText}>{"Search Podcast"}</p>
                </Row>
                <p style={sectionText}>{"Look up the podcast and episode that you want to share!"}</p>
              </div>
            </Col>
            <Col lg={4}>
              <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                <Row>
                  <Col md={3}>
                    <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/clapper_green.png" />
                  </Col>
                  <p style={sectionTitleText}>{"Clip a highlight"}</p>
                </Row>
                <p style={sectionText}>{"Create a highlight clip from any existing podcast and share it to any genre!"}</p>
              </div>
            </Col>
            <Col lg={4}>
              <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                <Row>
                  <Col md={3}>
                    <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/up_green.png" />
                  </Col>
                  <p style={sectionTitleText}>{"Vote"}</p>
                </Row>
                <p style={sectionText}>{"Clips can be upvoted. The more upvotes a clip gets, the faster it'll climb up the Trending list!"}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default BestPodcastPage;
