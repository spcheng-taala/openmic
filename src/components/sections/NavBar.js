import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

const toolbarStyle = {
  backgroundColor : '#6068C1'
}

const toolbarTitleStyle = {
  fontFamily: "Lato",
  color: '#FFFFFF'
}

class NavBar extends Component {
	render() {
		return (
      <MuiThemeProvider>
        <Toolbar style={toolbarStyle}>
          <ToolbarGroup>
            <ToolbarTitle style={toolbarTitleStyle} text="Armchair GMs" />
          </ToolbarGroup>
          <ToolbarGroup firstChild={true}>
            <span className={this.props.currentPage==1 ? 'nav-link-selected':'nav-link'} onClick={() => this.props.history.push('/draft/big-board')}>My Big Board</span>
            <span className={this.props.currentPage==2 ? 'nav-link-selected':'nav-link'} onClick={() => this.props.history.push('/draft/coming-soon')}>Community Mock Draft</span>
            <span className={this.props.currentPage==3 ? 'nav-link-selected':'nav-link'} onClick={() => this.props.history.push('/draft/mock')}>Mock Draft</span>
            <span className={this.props.currentPage==4 ? 'nav-link-selected':'nav-link'} onClick={() => this.props.history.push('/draft/prospects')}>Prospects</span>
            <span className='nav-link' onClick={() => this.props.history.push('/profile')}><Avatar src={"../../images/prof.png"} backgroundColor={'transparent'}/></span>
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
		)
	}
}

export default withRouter(NavBar);
