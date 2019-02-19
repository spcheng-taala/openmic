import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
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
  fontSize: 25,
}

const mediaTextStyleSmall = {
  paddingLeft: 60,
  align: 'center',
  color: '#36454f',
  fontFamily: "Lato",
  fontSize: 20,
}

class MessagesPage extends Component {

  constructor(props) {
    super(props);

    this.renderMessages = this.renderMessages.bind(this);
    this.handleMessageClick = this.handleMessageClick.bind(this);
  }

  handleMessageClick(message) {
    this.props.openMessageModal(message.sender_name, message.sender_email, message.sender_id);
  }

  renderMessages() {
    return (
      <div>
        <ul style={listStyle}>
            {this.props.messages.map(item => (
              <div style={cardStyle}>
                <CardActionArea onClick={() => this.handleMessageClick(item)}>
                  <Paper style={mediaStyle} elevation={1}>
                    <Typography style={mediaTextStyle}>
                      {"From: " + item.sender_name}
                    </Typography>
                    <Typography style={mediaTextStyleSmall}>
                      {item.message}
                    </Typography>
                  </Paper>
                </CardActionArea>
              </div>
            ))}
          </ul>
      </div>
    )
  }

  render() {
		return (
      <div>
        {this.renderMessages()}
      </div>
    )
  }
}

export default MessagesPage;
