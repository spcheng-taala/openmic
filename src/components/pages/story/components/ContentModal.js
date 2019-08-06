import React, { Component } from 'react';
import ReactPlayer from 'react-player';

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

class ContentModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
		return (
      <div>
        <div style={root}>
          <img style={{width: 400}} src={this.props.content.gifUrl}/>
        </div>
        <button className="button-green" style={{margin: 20, float: 'right'}} onClick={() => this.props.resizeVideo()}>{"Done"}</button>
        <button className="button-red" style={{margin: 20, float: 'right'}} onClick={() => this.props.closeContentModal()}>{"Cancel"}</button>
      </div>
    )
  }
}

export default ContentModal;
