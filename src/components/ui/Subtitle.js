import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  yellow: {
    color: "#F8BA00",
  }
}

class Subtitle extends Component {
  constructor(props) {
    super(props);

    this.renderTitle = this.renderTitle.bind(this);
  };

  renderTitle() {
    if (this.props.color == "yellow") {
      return (
        <h3 className="subtitle" style={styles.yellow}>{this.props.subtitle}</h3>
      );
    } else {
      return (
        <h3 className="subtitle" >{this.props.subtitle}</h3>
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

export default Subtitle;
