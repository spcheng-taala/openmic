import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

const toolbarStyle = {
  backgroundColor : '#AARRGGBB'
}

const toolbarTitleStyle = {
  fontFamily: "Lato",
  color: '#FFFFFF'
}

class PlayerNavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: this.props.currentPage
    };

    this.onNavBarItemClick = this.onNavBarItemClick.bind(this);
  }

  onNavBarItemClick(index) {
    this.props.onPlayerNavBarClicked(index)
    if (index != 1) {
      this.setState({currentPage: index});
    }
  }


	render() {
		return (
      <MuiThemeProvider>
        <Toolbar style={toolbarStyle}>
          <ToolbarGroup>
            <span className={this.state.currentPage==0 ? 'nav-link-selected':'nav-link'} onClick={() => this.onNavBarItemClick(0)}>Film</span>            
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
		)
	}
}

export default withRouter(PlayerNavBar);
