import React, { Component } from 'react';
import Modal from 'react-modal';
import { Container, Row, Col } from 'react-grid-system';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';
import UtilsManager from '../../../singletons/UtilsManager.js';

const styles = theme => ({
	textField: {
		fontFamily: 'Lato',
		textAlign: 'center',
		color: '#FF0081',
    fontSize: 30,
	},
  placeholder: {
    textAlign: 'center',
		color: '#FF0081',
    fontSize: 17,
		fontFamily: 'Lato',
  }
});

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
                gemCount: 0,
              });
            }
          });
        } else {
          this.setState({
            gemCount: data.gem_count,
          });
        }
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: 1,
      gemCount: 0,
    }

    this.renderTitleText = this.renderTitleText.bind(this);
    this.handleGemAmountChange = this.handleGemAmountChange.bind(this);
		this.renderBuySendGemsButton = this.renderBuySendGemsButton.bind(this);
    this.sendGems = this.sendGems.bind(this);
		this.buyGems = this.buyGems.bind(this);
  }

  renderTitleText() {
    if (this.props.commentId > 0) {
      return (
        <p style={topTextStyle}>{'How many Gems do you want to add?'}</p>
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

	buyGems() {
		this.props.openBuyGemsModal();
		this.props.closeContributeGemsModal();
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

	renderBuySendGemsButton() {
		if (this.state.gemCount < this.state.amount) {
			return (
				<button className="button-rounded-green" style={{marginTop: 20}} onClick={() => this.buyGems()}>{"Buy Gems"}</button>
			);
		} else {
			return (
				<button className="button-rounded-green" style={{marginTop: 20}} onClick={() => this.sendGems()}>{"Send Gems"}</button>
			);
		}
	}

  render() {
    const { classes } = this.props;
		return (
      <div style={{padding: 0, width: 500, backgroundColor: '#18161B'}}>
        {this.renderTitleText()}
        <p style={textStyle}>{'You have ' + UtilsManager.convertToCommaString(this.state.gemCount) + ' Gems'}</p>
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
				{this.renderBuySendGemsButton()}
      </div>
    )
  }
}

export default withStyles(styles)(ContributeGemsModal);
