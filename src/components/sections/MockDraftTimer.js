import React, { Component } from 'react';

class MockDraftTimer extends Component {
  constructor (props) {
    super(props)
    this.state = {count: 1}

    this.stopTimer = this.stopTimer.bind(this);
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  tick() {    
    if (this.state.count == this.props.pick) {
      clearInterval(this.timer);
    } else {
      this.setState({count: (this.state.count + 1)})
    }
  }

  startTimer () {
    clearInterval(this.timer)
    this.timer = setInterval(this.tick.bind(this), 1000)
  }

  stopTimer () {
    clearInterval(this.timer)
  }
  render () {
    return (
      <div>
        <button className="button" onClick={this.startTimer.bind(this)}>
          Start!
        </button>
      </div>
    )
  }
}

export default MockDraftTimer;
