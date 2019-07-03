import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

class BrokenPageSection extends Component {
	render() {
		return (
      <div style={{height: "100%", width: "100%"}}>
				<div>
          <div style={{margin: 20}}/>
          <img style={{display: 'block', margin: 'auto', width: '40%'}} src='../../../../../images/broken_page_icon.png' />
          <h1 style={{textAlign: 'center', fontSize: 50}}>{"Whoops"}</h1>
          <p style={{textAlign: 'center'}}>{"Looks like this page doesn't exist!"}</p>
          <button className='button-rounded-green' onClick={() => this.props.history.push('/')}>
            {"Go Home"}
          </button>
        </div>
      </div>
		)
	}
}

export default withRouter(BrokenPageSection);
