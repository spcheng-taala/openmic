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

class UploadingModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
		return (
      <div>
        <div style={root}>
          <ReactPlayer url={'https://media2.giphy.com/media/3o7TKSha51ATTx9KzC/200.mp4'} playing loop />
        </div>
        <h3 style={{color: 'grey', textAlign: 'center'}}>Posting! Give us one sec!</h3>
      </div>
    )
  }
}

export default UploadingModal;
