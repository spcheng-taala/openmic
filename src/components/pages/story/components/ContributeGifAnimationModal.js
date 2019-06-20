import React, { Component } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

const gemLabelStyle1 = {
  fontWeight: 'bold',
  color:'#9A9B9C',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle2 = {
  fontWeight: 'bold',
  color:'#229CD2',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle3 = {
  fontWeight: 'bold',
  color:'#FF0081',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle4 = {
  fontWeight: 'bold',
  color:'#974BFF',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle5 = {
  fontWeight: 'bold',
  color:'#95D601',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle6 = {
  fontWeight: 'bold',
  color:'#FFC842',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

class ContributeGifAnimationModal extends Component {
  constructor(props) {
    super(props);

    this.renderAnimation = this.renderAnimation.bind(this);
    this.convertToCommaString = this.convertToCommaString.bind(this);
  }

  renderAnimation(gems) {
    if (gems < 100) {
      return (
        <div>
          <img style={{width: '100%'}} src='../../../../../images/gem_1_animated.gif'/>
          <Typography style={gemLabelStyle1}>
            {"You just contributed " + this.convertToCommaString(gems) + " Gems!"}
          </Typography>
        </div>
      )
    } else if (gems < 1000) {
      return (
        <div>
          <img
            style={{width: '100%'}}
            src='../../../../../../images/gem_2_animated.gif'/>
          <Typography style={gemLabelStyle2}>
            {"You just contributed " + this.convertToCommaString(gems) + " Gems!"}
          </Typography>
        </div>
      )
    } else if (gems < 5000) {
      return (
        <div>
          <img
            style={{width: '100%'}}
            src='../../../../../../images/gem_3_animated.gif'/>
          <Typography style={gemLabelStyle3}>
            {"You just contributed " + this.convertToCommaString(gems) + " Gems!"}
          </Typography>
        </div>
      )
    } else if (gems < 10000) {
      return (
        <div>
          <img
            style={{width: '100%'}}
            src='../../../../../../images/gem_4_animated.gif'/>
          <Typography style={gemLabelStyle4}>
            {"You just contributed " + this.convertToCommaString(gems) + " Gems!"}
          </Typography>
        </div>
      )
    } else if (gems < 25000) {
      return (
        <div>
          <img
            style={{width: '100%'}}
            src='../../../../../../images/gem_5_animated.gif'/>
          <Typography style={gemLabelStyle5}>
            {"You just contributed " + this.convertToCommaString(gems) + " Gems!"}
          </Typography>
        </div>
      )
    } else if (gems >= 25000) {
      return (
        <div>
          <img
            style={{width: '100%'}}
            src='../../../../../../images/gem_6_animated.gif'/>
          <Typography style={gemLabelStyle6}>
            {"You just contributed " + this.convertToCommaString(gems) + " Gems!"}
          </Typography>
        </div>
      );
    }
  }

  convertToCommaString(x) {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return ("0");
    }
  }

  render() {
		return (
      <div style={{width: 300}}>
        {this.renderAnimation(this.props.gems)}
      </div>
    )
  }
}

export default ContributeGifAnimationModal;
