import React, { Component } from 'react';
import Select from 'react-select';
import { withRouter } from "react-router-dom";


class GenreSelect extends Component {

  constructor(props) {
    super(props);

		this.handleGenreChange = this.handleGenreChange.bind(this);
  }

	handleGenreChange(genre) {
		this.props.setGenre(genre);
    this.props.history.push('/');
	}

  render() {
		return (
      <div style={{width: 300, marginRight: 20}}>
        <Select
          className='select'
          value={this.props.genre}
          onChange={this.handleGenreChange}
          options={this.props.genres}
        />
      </div>
    )
  }
}

export default withRouter(GenreSelect);
