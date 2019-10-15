import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Header from '../../ui/Header.js';
import MidTitle from '../../ui/MidTitle.js';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import { Helmet } from 'react-helmet';

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

 const gridList = {
   width: 500,
   height: 450,
 }

 const root = {
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   overflow: 'hidden',
   marginTop: 20,
 }

 const icon = {
   color: 'rgba(255, 255, 255, 0.54)'
 }

class HowItWorksPage extends Component {

  render() {
    const { classes } = this.props;
		return (
      <div>
        <Helmet>
          <title>{"How It Works - Riptide"}</title>
        </Helmet>
        <div className="landing-page">
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Don't just listen, create!"}</h1>
            <p style={text}>{"Add your own personal flair to your favorite podcasts. Clipping allows you to create short highlights from your favorite podcast. To start, simply find the episode that you want to clip and click 'Create Clip'!"}</p>
          </Container>
          <Container>
            <h1 style={{textAlign: 'center', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"How it works"}</h1>
            <Row>
              <Col lg={4}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/clapper_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Clip the audio"}</p>
                  </Row>
                  <p style={sectionText}>{"Cut the audio of your favorite portion of the podcast!"}</p>
                </div>
              </Col>
              <Col lg={4}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/tags.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Add Genres"}</p>
                  </Row>
                  <p style={sectionText}>{"Tag one or more genres! Your clip will be posted in each genre that you select."}</p>
                </div>
              </Col>
              <Col lg={4}>
                <div style={{borderStyle: 'solid', borderWidth: 2, borderColor: '#C4CCF3', borderRadius: 5, height: 175}}>
                  <Row>
                    <Col md={3}>
                      <img style={{width: 30, height: 30, marginTop: 18, marginLeft: 10}} src="../../../../../../images/share_green.png" />
                    </Col>
                    <p style={sectionTitleText}>{"Publish"}</p>
                  </Row>
                  <p style={sectionText}>{"Once you're done, click 'Publish' to share it with other fans!"}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default HowItWorksPage;
