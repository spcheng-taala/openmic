import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';

 const root = {
   paddingTop: 50,
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   overflow: 'hidden',
 }

 const text = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 20,
   textAlign: 'center',
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

class AboutPage extends Component {

  componentDidMount() {
    this.props.hideDrawer(true);
  }

  componentWillUnmount() {
    this.props.hideDrawer(false);
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        <div className="landing-page">
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"It's more than just listening"}</h1>
            <p style={text}>{"Welcome to OpenMic! We are a home for podcasters and their fans. Whether you're looking to find new content to listen to, create and share a highlight, or just want to be a part of a community to laugh and have fun with, you'll find it here. With clipping and comments, you don't just listen to podcasts, you're a part of the experience."}</p>
          </Container>
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Become a creator"}</h1>
            <section className="section-a">
              <Container>
                <Row>
                  <Col lg={6}>
                    <img className="laptop" src="../../../../../../images/about_podcasts_img.png" />
                  </Col>
                  <Col lg={6}>
                    <p style={titleText}>{"Find listeners"}</p>
                    <p style={descText}>{"Getting people to listen to your podcast from scratch is hard. Don't worry though, we have tools that will make sharing your podcasts easier! Our clipping features turn the best parts of your podcasts into short videos that can be easily seen on popular social media websites."}</p>
                    <p style={titleText}>{"Build your fanbase"}</p>
                    <p style={descText}>{"You don't have to do this part alone! Listeners and content creators work together to create a community and culture. They'll also be able to share highlights from your podcasts and add their own flair to it."}</p>
                    <p style={titleText}>{"Get rewarded for your had work"}</p>
                    <p style={descText}>{"As you continue to get fans, we will work continuously with you to build a platform where you can make money."}</p>
                  </Col>
                </Row>
              </Container>
            </section>
          </Container>
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"How it works"}</h1>
            <Row>
              <Col lg={3}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/record_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Upload a podcast"}</p>
                  </Row>
                  <p style={sectionText}>{"Content creators can upload their podcasts on our site. We will work on tracking all the important metrics."}</p>
                </div>
              </Col>
              <Col lg={3}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/clapper_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Clip a highlight"}</p>
                  </Row>
                  <p style={sectionText}>{"Create a highlight clip from any existing podcast and share it on any social platform!"}</p>
                </div>
              </Col>
              <Col lg={3}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/comment_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Comment"}</p>
                  </Row>
                  <p style={sectionText}>{"Listeners and creators can comment on clips and podcasts. Comments provide discussion and humor!"}</p>
                </div>
              </Col>
              <Col lg={3}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/up_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Vote"}</p>
                  </Row>
                  <p style={sectionText}>{"Podcasts and clips can be upvoted. The funniest and most interesting content gets featured!"}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Get Rewarded"}</h1>
          <p style={text}>{"If your podcast has a large number of fans interacting on our platform, we will work with you to open options for you to get rewarded for your hard work! Whether through direct subscriptions, tips, or advertising partners, we will make sure that your time was well worth it!"}</p>
        </Container>
      </div>
    )
  }
}

export default AboutPage;
