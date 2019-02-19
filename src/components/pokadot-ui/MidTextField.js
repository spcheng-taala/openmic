import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const titleStyle = {
  fontFamily: "Lato",  
}

const styles = theme => ({
  label: {
    fontFamily: "Lato",
    color: "#FC1684"
  },
  resize: {
    fontFamily: "Lato",
    fontSize: 20,
  },
});

class MidTextField extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <TextField
        id="title"
        label={this.props.label}
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
        value={this.props.value}
        fullWidth={this.props.fullWidth}
        margin="normal"
      />
    );
  }
}

MidTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MidTextField);
