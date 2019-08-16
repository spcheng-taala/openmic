import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Planet } from 'react-kawaii';

const animationRoot = {
  display: 'flex',
  flexWrap: 'wrap',
  height: 250,
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 100,
}

class SponsorWelcomeSection extends Component {

  componentDidMount() {
    var sponsorsJson = localStorage.getItem('sponsors');
    if (sponsorsJson) {
      this.setState({
        hasDeals: true,
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      hasDeals: false,
    }

    this.renderHasDeals = this.renderHasDeals.bind(this);
  }

  renderHasDeals() {
    if (this.state.hasDeals) {
      return (
        <button className='button-rounded-green' onClick={() => this.props.signIn()}>
          {"You already have some deals waiting for you! Sign up to check them out!"}
        </button>
      )
    } else {
      return (
        <button className='button-rounded-green' onClick={() => this.props.history.push('/')}>
          {"Start listening"}
        </button>
      );
    }
  }

	render() {
		return (
      <div style={{height: "100%", width: "100%"}}>
				<div>
          <div style={{margin: 20}}/>
          <h3 style={{textAlign: 'center', color: '#18161B', marginTop: 20}}>{"Your deals are here! You get deals anytime you listen to a clip or a podcast!"}</h3>
          {this.renderHasDeals()}          
          <div style={animationRoot}>
            <Planet className='floating' size={200} mood="shocked" color="#FCCB7E" />
          </div>
        </div>
      </div>
		)
	}
}

export default withRouter(SponsorWelcomeSection);
