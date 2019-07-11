import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';

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

class CommunityPage extends Component {

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
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Don't just listen, join in!"}</h1>
            <p style={text}>{"Welcome to Riptide! We are a home for podcasters and their fans. Whether you're looking to find new content to listen to, create and share a highlight, or just want to be a part of a community to laugh and have fun with, you'll find it here. With clipping and comments, you don't just listen to podcasts, you're a part of the experience."}</p>
          </Container>
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Join a community"}</h1>
            <section className="section-a">
              <Container>
                <Row>
                  <Col lg={6}>
                    <img className="laptop" src="../../../../../../images/about_podcasts_img.png" />
                  </Col>
                  <Col lg={6}>
                    <p style={titleText}>{"Interact"}</p>
                    <p style={descText}>{"Whether you want to chat it up with your favorite podcasters or just chill out and liste/watch your favorite content, we're the perfect place for you!"}</p>
                    <p style={titleText}>{"Create"}</p>
                    <p style={descText}>{"Part of being a super fan is helping your favorite creators get the word out about their content. Here you can add your own flair to your favorite podcasts and let the whole world see your what you see."}</p>
                    <p style={titleText}>{"Contribute"}</p>
                    <p style={descText}>{"You can support by contributing Gems to comments on any podcast or clip. Gems directly support the creators. Comments with contributed Gems will always get a response from the creator, allowing you to interact with them whenever you like!"}</p>
                  </Col>
                </Row>
              </Container>
            </section>
          </Container>
          <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Start Now"}</h1>
          <p style={text}>{"Listening to a podcast is just the start. Here, you'll find where you belong."}</p>
        </div>
      </div>
    )
  }
}

export default CommunityPage;
