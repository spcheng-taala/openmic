import React, { Component } from 'react';

class FooterText extends Component {
  render() {
    return (
      <div>
        <p className="footer-text">{this.props.paragraph}</p>
      </div>
    )
  }
}

export default FooterText;
