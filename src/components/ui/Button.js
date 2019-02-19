import React, { Component } from 'react';

class Button extends Component {
  render() {
    return (
      <div>
        <button
          className={this.props.className}
          onClick={this.props.onClickHandler}
        >
          {this.props.buttonLabel}
        </button>
      </div>
    )
  }
}

export default Button;
