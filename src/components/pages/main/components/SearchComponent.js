import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: "Lato",
  },
});

class SearchComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      podcast: "",
    }

    this.searchPodcasts = this.searchPodcasts.bind(this);
		this.handlePodcastChange = this.handlePodcastChange.bind(this);
  }

  searchPodcasts(event) {
		if (event.key == 'Enter') {
			this.props.history.push('/search?q=' + encodeURIComponent(this.state.podcast));
      var genre = {
        value: "Search Results",
        label: "Search Results",
      };
      this.props.setGenre(genre);
		}
	}

	handlePodcastChange(e) {
		this.setState({
      podcast: e.target.value
    });
	}

  render() {
    const { classes } = this.props;
		return (
      <div style={{width: '100%', marginRight: 20}}>
        <Paper style={{width: '100%', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10}}>
          <InputBase
            className={classes.textFieldInputRoot}
            fullWidth
            placeholder="Search Podcasts"
            onChange={this.handlePodcastChange}
            onKeyPress={event => this.searchPodcasts(event)}
          />
        </Paper>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(SearchComponent));
