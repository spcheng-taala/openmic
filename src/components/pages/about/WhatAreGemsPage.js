import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BackendManager from '../../singletons/BackendManager.js';
import UserManager from '../../singletons/UserManager.js';

const gemIconStyle = {
  marginLeft: 10,
  width: 20,
  height: 20,
  marginBottom: 10,
};

 const root = {
   paddingTop: 50,
   display: 'flex',
   flexWrap: 'wrap',
   justifyContent: 'space-around',
   overflow: 'hidden',
 }

 const titleStyle = {
   fontWeight: 'bold',
   color: "#2A2D33",
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

 const sectionText = {
   color: '#2A2D34',
   fontFamily: 'Lato',
   fontSize: 17,
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

    if (this.props.isLoggedIn) {
      if (UserManager.id <= 0) {
        var id = localStorage.getItem('id');
        UserManager.id = id;
      }
      BackendManager.makeQuery('gems/user', JSON.stringify({
        user_id: UserManager.id,
      }))
      .then(data => {
        if (data.success) {
          console.log(data);
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
    this.renderGemItem = this.renderGemItem.bind(this);
    this.handleBuyGems = this.handleBuyGems.bind(this);
  }

  convertToDollars(cents) {
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
  }

  handleBuyGems(gem) {
    if (this.props.isLoggedIn) {
      localStorage.setItem("gem_id", gem.id);
      localStorage.setItem("gem_quantity", gem.quantity);
      localStorage.setItem("gem_price", gem.price);
      window.open(UserManager.domain + 'checkout', "_blank");
    } else {
      this.props.openLoginModal();
    }
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
              {this.renderGemIcons(gem)}
            </Col>
            <button style={{float: 'right'}} className="button-rounded-green-no-mar-small" onClick={() => this.handleBuyGems(gem)}>{this.convertToDollars(gem.price)}</button>
          </Row>
        </Container>
      </div>
    );
  }

  renderGemIcons(gem) {
    if (gem.id == 1) {
      return (
        <Row>
          <img style={gemIconStyle} src={"../../../../../../images/gem_1_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_2_10x.png"}/>
        </Row>
      );
    } else if (gem.id == 2) {
      return (
        <Row>
          <img style={gemIconStyle} src={"../../../../../../images/gem_1_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_2_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_3_10x.png"}/>
        </Row>
      );
    } else if (gem.id == 3) {
      return (
        <Row>
          <img style={gemIconStyle} src={"../../../../../../images/gem_1_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_2_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_3_10x.png"}/>
        </Row>
      );
    } else if (gem.id == 4) {
      return (
        <Row>
          <img style={gemIconStyle} src={"../../../../../../images/gem_1_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_2_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_3_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_4_10x.png"}/>
        </Row>
      );
    } else if (gem.id == 5) {
      return (
        <Row>
          <img style={gemIconStyle} src={"../../../../../../images/gem_1_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_2_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_3_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_4_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_5_10x.png"}/>
        </Row>
      );
    } else if (gem.id == 6) {
      return (
        <Row>
          <img style={gemIconStyle} src={"../../../../../../images/gem_1_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_2_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_3_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_4_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_5_10x.png"}/>
          <img style={gemIconStyle} src={"../../../../../../images/gem_6_10x.png"}/>
        </Row>
      );
    }
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
                  <p style={text}>{"Gems are a virtual good you can use to Contribute. You can Contribute to any comment on any Clip or Podcast. The more Gems that are Contributed to a comment, the more it gets noticed. In order for the Creator to accept all the Gems that have been Contributed, they must reply with a video to the comment. Contributing Gems is our way of supporting our creators and fostering a community around them."}</p>
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
