import React, { Component } from 'react';
import Modal from 'react-modal';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MidTitle from '../../../ui/MidTitle.js';
import Button from '../../../ui/Button.js';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';

const styles = theme => ({
	textField: {
		textAlign: 'center',
		color: '#FF0081',
    fontSize: 30,
	},
  placeholder: {
    textAlign: 'center',
		color: '#FF0081',
    fontSize: 17,
  }
});

const titleStyle = {
  fontWeight: 'bold',
  color: "#DAD8DE",
  font: "Lato",
  textAlign: "left",
  fontSize: 20,
}

const textStyle = {
  color: "#D4D2D8",
  font: "Lato",
  textAlign: "center",
  fontSize: 20,
}

const topTextStyle = {
  fontWeight: 'bold',
  color: "#D4D2D8",
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
  marginBottom: 10,
}

var storyPaperStyle = {
  marginTop: 10,
  padding: 10,
}

var storyTitleStyle = {
  paddingLeft: 10,
  align: 'center',
  color: '#222225',
  fontFamily: "Lato",
  fontSize: 16,
}

const inputStyle = {
  visibility: 'hidden',
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class ContributeGemsModal extends Component {

  componentDidMount() {
    BackendManager.makeQuery('gems/user', JSON.stringify({
      user_id: UserManager.id,
    }))
    .then(data => {
      if (data.success) {
        if (data.gem_count < 0) {
          BackendManager.makeQuery('gems/user/create', JSON.stringify({
            user_id: UserManager.id,
            gem_count: 0,
          }))
          .then(data => {
            if (data.success) {
              this.setState({
                gem_count: 0,
              });
            }
          });
        } else {
          this.setState({
            gem_count: data.gem_count,
          });
        }
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: 1,
      gem_count: 0,
    }

    this.renderTitleText = this.renderTitleText.bind(this);
    this.handleGemAmountChange = this.handleGemAmountChange.bind(this);
    this.sendGems = this.sendGems.bind(this);
  }

  renderTitleText() {
    if (this.props.commentId > 0) {
      return (
        <p style={topTextStyle}>{'How many Gems do you want to contribute?'}</p>
      );
    } else {
      return (
        <p style={topTextStyle}>{'How many Gems do you want to send?'}</p>
      );
    }
  }

  handleGemAmountChange(e) {
    if (/^\+?(0|[1-9]\d*)$/.test(e.target.value) || (!e.target.value || 0 === e.target.value.length)) {
      this.setState({
        amount: e.target.value
      });
    }
  }

  sendGems() {
    if (/^\+?(0|[1-9]\d*)$/.test(this.state.amount)) {
      if (this.props.commentId > 0) {
        this.props.contributeGems(this.props.commentId, this.state.amount);
      } else {
        this.props.createComment(this.state.amount);
      }
    }
  }

  render() {
    const { classes } = this.props;
		return (
      <div style={{padding: 0, width: 500, backgroundColor: '#18161B'}}>
        {this.renderTitleText()}
        <p style={textStyle}>{'You have ' + this.state.gem_count + ' Gems'}</p>
        <div style={{width: '50%', margin: '0 auto'}}>
          <TextField
            id="outlined-number"
            className={classes.textField}
            value={this.state.amount}
            onChange={this.handleGemAmountChange}
            type="number"
            InputProps={{
              classes: {
                input: classes.textField
              },
            }}
            InputLabelProps={{
              shrink: true,
              FormLabelClasses: {
                root: classes.placeholder
              }
            }}
            margin="normal"
          />
        </div>
        <button className="button-rounded-purple" onClick={() => window.open('http://localhost:3000/howitworks/gems', "_blank")}>{"What are Gems?"}</button>
        <button className="button-rounded-green" style={{marginTop: 20}} onClick={() => this.sendGems()}>{"Send Gems"}</button>
      </div>
    )
  }
}

export default withStyles(styles)(ContributeGemsModal);
