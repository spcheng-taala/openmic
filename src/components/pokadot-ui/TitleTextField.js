import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const titleStyle = {
  fontFamily: "Lato",
  marginBottom: 20,
}

const styles = theme => ({
  label: {
    fontFamily: "Lato",
    color: "#8B80F9",
  },
  resize: {
    fontFamily: "Lato",
    fontSize: 40,
  },
});

class TitleTextField extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <TextField
        id="title"
        label="Title"
        style={titleStyle}
        InputLabelProps={{
          shrink: true,
          classes: {
            root: classes.label
          }
        }}
        InputProps={{
            classes: {
              input: classes.resize,
            },
        }}
        onChange={this.props.handleChange}
        placeholder="Title"
        value={this.props.title}
        fullWidth
        margin="normal"
      />
    );
  }
}

TitleTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitleTextField);
