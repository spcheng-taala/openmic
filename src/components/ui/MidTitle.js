import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  yellow: {
    color: "#F8BA00",
  }
}

class MidTitle extends Component {
  constructor(props) {
    super(props);

    this.renderTitle = this.renderTitle.bind(this);
  };

  renderTitle() {
    if (this.props.color == "yellow") {
      return (
        <h2 className="midtitle" style={styles.yellow}>{this.props.midtitle}</h2>
      );
    } else {
      return (
        <h2 className="midtitle">{this.props.midtitle}</h2>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
      </div>
    )
  }
}

export default MidTitle;
