import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Typography from '@material-ui/core/Typography';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';
import UtilsManager from '../../../singletons/UtilsManager.js';

const gemIconStyle = {
  marginLeft: 10,
  width: 20,
  height: 20,
  marginBottom: 10,
};

const titleStyle = {
  fontWeight: 'bold',
  color: "#DAD8DE",
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const textStyle = {
  color: "#D4D2D8",
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const topTextStyle = {
  fontWeight: 'bold',
  color: "#D4D2D8",
  font: "Lato",
  textAlign: "center",
  fontSize: 15,
  marginBottom: 10,
}

class BuyGemsModal extends Component {

  componentDidMount() {
    BackendManager.makeQuery('gems/all', JSON.stringify({}))
    .then(data => {
      if (data.success) {
        this.setState({
          gems: data.gems,
        });
      }
    });

    if (this.props.isLoggedIn) {
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
    } else {
      this.setState({
        gem_count: 0,
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      gems: [],
      gem_count: 0,
    }

    this.renderGemItem = this.renderGemItem.bind(this);
    this.handleBuyGems = this.handleBuyGems.bind(this);
    this.renderGemIcons = this.renderGemIcons.bind(this);
  }

  renderGemItem(gem) {
    return (
      <div>
        <div style={{height: 1, backgroundColor: '#333333', width: '100%'}} />
        <Container style={{marginTop: 10}}>
          <Row>
            <Col>
              <Typography style={titleStyle}>
                {UtilsManager.convertToCommaString(gem.quantity) + " Gems"}
              </Typography>
              {this.renderGemIcons(gem)}
            </Col>
            <div style={{float: 'right'}}>
              <button className="button-rounded-green-no-mar-small" onClick={() => this.handleBuyGems(gem)}>{UtilsManager.convertToDollars(gem.price)}</button>
            </div>
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

  handleBuyGems(gem) {
    if (this.props.isLoggedIn) {
      localStorage.setItem("gem_id", gem.id);
      localStorage.setItem("gem_quantity", gem.quantity);
      localStorage.setItem("gem_price", gem.price);
      window.open(UserManager.domain + 'checkout', "_blank");
    } else {
      this.props.openLoginModal();
      this.props.closeBuyGemsModal();
    }
  }

  render() {
		return (
      <div style={{padding: 0, width: 400, backgroundColor: '#18161B'}}>
        <p style={topTextStyle}>{'You have ' + UtilsManager.convertToCommaString(this.state.gem_count) + ' gems'}</p>
        <p style={textStyle}>{'Prices are shown in USD'}</p>
        <ul style={{margin: 0, padding: 0}}>
          {this.state.gems.map((item) => {
            return (this.renderGemItem(item))
          })}
        </ul>
        <button className="button-rounded-purple" style={{marginTop: 10}} onClick={() => window.open(UserManager.domain + 'howitworks/gems', "_blank")}>{"What are Gems?"}</button>
      </div>
    )
  }
}

export default BuyGemsModal;
