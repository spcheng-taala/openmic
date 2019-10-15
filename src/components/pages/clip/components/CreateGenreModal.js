import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import BackendManager from '../../../singletons/BackendManager.js';

const styles = theme => ({
  textFieldInputRoot: {
    fontFamily: "Lato",
  },
});

class CreateGenreModal extends Component {

  componentDidMount() {
    this.setState({
      genre: ""
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      genre: "",
    }

    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.createGenre = this.createGenre.bind(this);
  }

  handleGenreChange(e) {
    this.setState({
      genre: e.target.value
    });
  }

  createGenre() {
    BackendManager.makeQuery('genres/check', JSON.stringify({
      name: this.state.genre,
    }))
    .then(data => {
      if (data.success) {
        if (data.exists) {
          this.props.showToast('This genre already exists!', 'custom');
        } else {
          BackendManager.makeQuery('genres/create', JSON.stringify({
            name: this.state.genre,
          }))
          .then(data => {
            if (data.success) {
              var genre = {
                id: data.id,
                name: this.state.genre,
              };
              this.props.createGenre(genre);
            }
          });
        }
      }
    });
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={{padding: 0, width: 400, backgroundColor: '#18161B'}}>
        <Paper style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10}}>
          <InputBase
            className={classes.textFieldInputRoot}
            fullWidth
            placeholder="Enter Your Genre Here"
            onChange={this.handleGenreChange}
          />
        </Paper>
        <button className="button-rounded-purple" style={{marginTop: 10}} onClick={() => this.createGenre()}>{"Done"}</button>
      </div>
    )
  }
}

export default withStyles(styles)(CreateGenreModal);
