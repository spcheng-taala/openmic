import React, { Component } from 'react';
import Modal from 'react-modal';

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}

class LoadingModal extends Component {
  render() {
		return (
      <div>
        <h2 style={titleStyle}>{"Uploading... Give us one sec!"}</h2>
      </div>
    )
  }
}

export default LoadingModal;
