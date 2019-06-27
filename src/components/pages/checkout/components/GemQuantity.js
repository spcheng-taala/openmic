import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';

class GemQuantity extends Component {

  constructor(props) {
    super(props);

    this.state = {
      multiple: 1,
    }

    this.renderGemItem = this.renderGemItem.bind(this);
    this.convertToDollars = this.convertToDollars.bind(this);
    this.convertQuantity = this.convertQuantity.bind(this);
    this.handleMultipleChange = this.handleMultipleChange.bind(this);
  }

  convertToDollars(cents) {
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
  }

  convertQuantity() {
    if (this.props.quantity) {
      return this.props.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return ("");
    }
  }

  renderGemItem() {
    if (this.props.id == 1) {
      return (
        <div>
          <img style={{margin: 10, width: 230}} src='../../../../../images/gem_3_10x.png'/>
          <p className="co-label" style={{marginLeft: 20}}>
            {"100 Gems"}
          </p>
        </div>
      );
    } else if (this.props.id == 2) {
      return (
        <div>
          <img style={{margin: 10, width: 230}} src='../../../../../images/gem_stack_2.png'/>
          <p className="co-label" style={{marginLeft: 20}}>
            {"1,000 Gems"}
          </p>
        </div>
      );
    } else if (this.props.id == 3) {
      return (
        <div>
          <img style={{margin: 10, width: 230}} src='../../../../../images/gem_stack_3.png'/>
          <p className="co-label" style={{marginLeft: 20}}>
            {"1,500 Gems"}
          </p>
        </div>
      );
    } else if (this.props.id == 4) {
      return (
        <div>
          <img style={{margin: 10, width: 230}} src='../../../../../images/gem_stack_4.png'/>
          <p className="co-label" style={{marginLeft: 20}}>
            {"5,000 Gems"}
          </p>
        </div>
      );
    } else if (this.props.id == 5) {
      return (
        <div>
          <img style={{margin: 10, width: 230}} src='../../../../../images/gem_stack_5.png'/>
          <p className="co-label" style={{marginLeft: 20}}>
            {"10,000 Gems"}
          </p>
        </div>
      );
    } else if (this.props.id == 6) {
      return (
        <div>
          <img style={{margin: 10, width: 230}} src='../../../../../images/gem_stack_6.png'/>
          <p className="co-label" style={{marginLeft: 20}}>
            {"25,000 Gems"}
          </p>
        </div>
      );
    }
  }

  handleMultipleChange(e) {
    this.setState({
      multiple: e.target.value
    })
    this.props.handleMultipleChange(e.target.value);
  }

  render() {

    return (
      <div style={{marginTop: 10, marginLeft: 20, width: 250}}>
        <Paper elevation={1} style={{backgroundColor: 'white', paddingBottom: 10, paddingTop: 10}}>
          <div>
            {this.renderGemItem()}
          </div>
        </Paper>
        <form style={{marginTop: 10}}>
          <label>
            <select value={this.state.multiple} onChange={this.handleMultipleChange}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
            </select>
          </label>
        </form>
        <Paper elevation={1} style={{backgroundColor: 'white', paddingBottom: 10, paddingTop: 10, marginTop: 20}}>
          <div>
            <p className="co-label" style={{marginLeft: 10, fontSize: 20, fontWeight: 'bold'}}>
              {"Order Summary"}
            </p>
            <div style={{backgroundColor: 'grey', height: 1, margin: 10}} />
            <Row>
              <Col>
                <p className="co-label" style={{marginLeft: 10, fontWeight: 'bold'}}>
                  {this.convertQuantity() + " Gems (x " + this.state.multiple + "):"}
                </p>
              </Col>
              <p className="co-label" style={{float: 'right', fontWeight: 'bold', textAlign: 'right', marginRight: 20}}>
                {this.convertToDollars(this.props.price * this.state.multiple)}
              </p>
            </Row>
            <Row>
              <Col>
                <p className="co-label" style={{marginLeft: 10, fontWeight: 'bold'}}>
                  {"Subtotal: "}
                </p>
              </Col>
              <p className="co-label" style={{float: 'right', fontWeight: 'bold', textAlign: 'right', marginRight: 20}}>
                {this.convertToDollars(this.props.price * this.state.multiple)}
              </p>
            </Row>
            <Row>
              <Col>
                <p className="co-label" style={{marginLeft: 10, fontSize: 20, fontWeight: 'bold'}}>
                  {"Total: "}
                </p>
              </Col>
              <p className="co-label" style={{float: 'right', fontSize: 20, textAlign: 'right', fontWeight: 'bold', marginRight: 20}}>
                {this.convertToDollars(this.props.price * this.state.multiple)}
              </p>
            </Row>
          </div>
        </Paper>
      </div>
    )
  }
}

export default GemQuantity;
