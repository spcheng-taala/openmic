import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const bigStyle = {
  fontFamily: "Lato",
  marginTop: 20,
  marginBottom: 40,
}

const styles = theme => ({
  bigRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bigInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontFamily: "Lato",
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bigLabel: {
    fontFamily: "Lato",
    color: "#f0a30a",
    fontSize: 18,
  },
});

class BigTextField extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <TextField
        value={this.props.value}
        label={this.props.label}
        style={bigStyle}
        id="bigInput"
        fullWidth
        multiline
        InputProps={{
          disableUnderline: true,
          classes: {
            root: classes.bigRoot,
            input: classes.bigInput,
          },
        }}
        InputLabelProps={{
          shrink: true,
          className: classes.bigLabel,
        }}
        onChange={this.props.handleChange}
      />
    );
  }
}

BigTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BigTextField);
