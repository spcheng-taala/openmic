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
import Typography from '@material-ui/core/Typography';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';

 const root = {
   paddingTop: 50,
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   overflow: 'hidden',
 }

 const titleStyle = {
   fontWeight: 'bold',
   color: "#DAD8DE",
   font: "Lato",
   textAlign: "left",
   fontSize: 20,
 }

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
   textAlign: 'left',
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
 }

 const gridList = {
   width: 500,
   height: 450,
 }

 const icon = {
   color: 'rgba(255, 255, 255, 0.54)'
 }

class WhatAreGemsPage extends Component {

  componentDidMount() {
    this.props.hideDrawer(true);
    BackendManager.makeQuery('gems/all', JSON.stringify({}))
    .then(data => {
      if (data.success) {
        this.setState({
          gems: data.gems,
        });
      }
    });

    BackendManager.makeQuery('gems/user', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        if (data.gem_count < 0) {
          BackendManager.makeQuery('gems/user/create', JSON.stringify({
            user_id: UserManager.id,
            gem_count: 0,
          }))
          .then(data => {
            if (data.success) {
              this.setState({
                gem_count: 0,
              });
            }
          });
        } else {
          this.setState({
            gem_count: data.gem_count,
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.props.hideDrawer(false);
  }

  constructor(props) {
    super(props);
    this.state = {
      gems: [],
      gem_count: 0,
    }
    this.renderGemItem = this.renderGemItem.bind(this);
    this.convertToDollars = this.convertToDollars.bind(this);
  }

  convertToDollars(cents) {
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
  }

  renderGemItem(gem) {
    return (
      <div>
        <div style={{height: 1, backgroundColor: '#333333', width: '100%'}} />
        <Container style={{marginTop: 10}}>
          <Row>
            <Col>
              <Typography style={titleStyle}>
                {gem.quantity + " Gems"}
              </Typography>
            </Col>
            <button style={{float: 'right'}} className="button-rounded-green-no-mar-small">{this.convertToDollars(gem.price)}</button>            
          </Row>
        </Container>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
		return (
      <div>
        <div className="landing-page">
          <Container>
            <Row>
              <Col>
                <Container>
                  <h1 style={{textAlign: 'left', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"Send Gems to interact with and support your favorite podcasters!"}</h1>
                  <p style={text}>{"Gems are a virtual good you can use to Contribute. You can Contribute to any comment on any Clip or Podcast. The more Gems that are Contributed to a comment, the more it gets noticed. In order for the Creator to accept all the Gems that have been Contributed, they must reply to the comment. Contributing Gems is our way of supporting our creators and fostering a community around them."}</p>
                </Container>
                <Container>
                  <h1 style={{textAlign: 'left', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"How to Contribute"}</h1>
                  <p style={text}>{"There are two ways you can Contribute to a Creator. You can write your own comment on any Clip or Podcast. You can also Contribute to existing comments if you want that particular comment to get more recognition."}</p>
                </Container>
                <Container>
                  <h1 style={{textAlign: 'left', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"How much is a Gem?"}</h1>
                  <p style={text}>{"1 Gem is worth 1 cent USD."}</p>
                </Container>
                <Container>
                  <h1 style={{textAlign: 'left', fontSize: 50, color: '#3ABBBC', marginTop: 100}}>{"What are Gem emotes?"}</h1>
                  <p style={text}>{"Gem emotes are animated icons that make comments stand out. The more Gems Contributed to a comment, the more animated the gem."}</p>
                </Container>
              </Col>
              <Col style={{marginTop: 100}}>
                <p style={sectionText}>{'You have ' + this.state.gem_count + ' Gems'}</p>
                <p style={descText}>{'Prices are shown in USD'}</p>
                <ul style={{margin: 0, padding: 0}}>
                  {this.state.gems.map((item) => {
                    return (this.renderGemItem(item))
                  })}
                </ul>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

export default WhatAreGemsPage;
