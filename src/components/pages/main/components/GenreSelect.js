import React, { Component } from 'react';
import Select from 'react-select';
import { withRouter } from "react-router-dom";

const customStyles = {

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

class GenreSelect extends Component {

  constructor(props) {
    super(props);

    this.state = {
      genres: null,
    };

		this.handleGenreChange = this.handleGenreChange.bind(this);
  }

	handleGenreChange(genre) {
    this.props.setGenre(genre);
    if (genre.value.id == -1) {
      this.props.history.push('/genres');
    } else {
      this.props.history.push('/g/' + encodeURIComponent(genre.value.name));
    }
	}

  render() {
    var width = 200;
    if (this.props.isMobile) {
      width = 100;
    }
		return (
      <div style={{width: width, marginRight: 20}}>
        <Select
          className='select'
          styles={customStyles}
          value={this.props.genre}
          onChange={this.handleGenreChange}
          options={this.props.genres}
          formatGroupLabe={formatGroupLabel}
        />
      </div>
    )
  }
}

export default withRouter(GenreSelect);
