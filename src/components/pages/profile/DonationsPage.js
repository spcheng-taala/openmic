import React, { Component } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Header from '../../ui/Header.js';
import MidTitle from '../../ui/MidTitle.js';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';

const listStyle = {
  paddingRight: 40,
}

const cardStyle = {
  marginBottom: 30,
}

const mediaStyle = {
  width: '100%',
  paddingTop: 50,
  paddingBottom: 50,
  backgroundColor: '#FFFFFF'
}

const mediaTextStyle = {
  paddingLeft: 60,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 30,
}

const mediaTextStyleSmall = {
  paddingLeft: 60,
  align: 'center',
  color: 'grey',
  fontFamily: "Lato",
  fontSize: 20,
}

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
  fontSize: 35,
}

const totalDonationsStyle = {
  color: "#E6C229",
  font: "Lato",
  textAlign: "center",
  fontSize: 55,
}

class DonationsPage extends Component {

  constructor(props) {
    super(props);
    this.renderTotalDonations = this.renderTotalDonations.bind(this);
    this.renderDonations = this.renderDonations.bind(this);
  }

  renderTotalDonations() {
    return (
      <div>
        <h1 style={titleStyle}>{"Total donations so far:"}</h1>
        <h1 style={totalDonationsStyle}>{"$" + (this.props.totalDonations/100).toFixed(2)}</h1>
      </div>
    );
  }

  renderDonations() {
    return (
      <div>
        <ul style={listStyle}>
            {this.props.donations.map((item) => (
              <div style={cardStyle}>
              <Paper style={mediaStyle} elevation={1}>
                <div>
                  <Container>
                    <Row>
                      <div>
                        <Typography style={mediaTextStyle}>
                          {item.supporter_name + " - $" + (item.amount/100).toFixed(2)}
                        </Typography>
                        <Typography style={mediaTextStyleSmall}>
                          {"For: " + item.title}
                        </Typography>
                      </div>
                    </Row>
                  </Container>
                </div>
              </Paper>
              </div>
            ))}
          </ul>
      </div>
    );
  }

  render() {
		return (
      <div>
        {this.renderTotalDonations()}
        {this.renderDonations()}
      </div>
    )
  }
}

export default DonationsPage;
