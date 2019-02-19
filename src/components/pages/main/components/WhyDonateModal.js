import React, { Component } from 'react';

const root = {
  width: "80%",
}

const textStyle = {
  color: "grey",
  font: "Lato",
  marginTop: 18,
  marginLeft: 50,
  marginRight: 50,
  textAlign: "center",
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}


class WhyDonateModal extends Component {
  render() {
		return (
      <div>
        <h2 style={titleStyle}>Why donate?</h2>
        <p style={textStyle}>{"Donating to our Creators shows that you support them and enjoy what they're producing. It also provides a means for them to continue doing what they love doing. By donating you get the added benefit of directly interacting with them. Whether you simply want to say Thank You or want to give them feedback, it's a great way to interact with your favorite Creators."}</p>
      </div>
    )
  }
}

export default WhyDonateModal;
