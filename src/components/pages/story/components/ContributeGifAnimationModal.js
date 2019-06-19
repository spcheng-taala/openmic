import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';

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

class ContributeGifAnimationModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
		return (
      <div>
        <div style={root}>
          <img src={this.props.src} />
        </div>
        <h3 style={{color: 'grey', textAlign: 'center'}}>{this.props.text}</h3>
      </div>
    )
  }
}

export default ContributeGifAnimationModal;
