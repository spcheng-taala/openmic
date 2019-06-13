import React, { Component } from 'react';
import Modal from 'react-modal';
import { Container, Row, Col } from 'react-grid-system';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MidTitle from '../../../ui/MidTitle.js';
import Button from '../../../ui/Button.js';
import BackendManager from '../../../singletons/BackendManager.js';
import UserManager from '../../../singletons/UserManager.js';

const titleStyle = {
  fontWeight: 'bold',
  color: "#2D2D31",
  font: "Lato",
  textAlign: "left",
  fontSize: 20,
}

const centerVertical = {
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
}

const textStyle = {
  color: "#D4D2D8",
  font: "Lato",
  textAlign: "left",
  fontSize: 17,
}

const topTextStyle = {
  fontWeight: 'bold',
  color: "#D4D2D8",
  font: "Lato",
  textAlign: "center",
  fontSize: 15,
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


class ContributorsModal extends Component {

  componentDidMount() {
    BackendManager.makeQuery('clips/comments/gem/contributors', JSON.stringify({
      comment_id: this.props.commentId,
    }))
    .then(data => {
      if (data.success) {
        console.log(data);
        this.setState({
          users: data.users,
        });
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
    this.renderUserItem = this.renderUserItem.bind(this);
  }

  renderUserItem(user) {
    return (
      <div>
        <div style={{height: 1, width: '100%'}} />
        <Container style={{marginTop: 10}}>
          <Row>
            <Avatar src={user.profile_picture} style={{marginBottom: 10, marginLeft: 10, marginTop: 10, width: 50, height: 50, display: 'inline-block'}} />
            <Col>
              <div style={centerVertical}>
                <Typography style={titleStyle}>
                  {user.username}
                </Typography>
              </div>
            </Col>
            <div style={{float: 'right', marginRight: 10}}>
              <div style={centerVertical}>
                <Row>
                  <Typography style={titleStyle}>
                    {user.gems}
                  </Typography>
                  <img
                    style={{marginLeft: 5, height: 30, width: 30}}
                    src='../../../../../../images/gem.png'
                    />
                </Row>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }

  render() {
		return (
      <div style={{padding: 0, width: 500}}>
        <ul style={{margin: 0, padding: 0}}>
          {this.state.users.map((item) => {
            return (this.renderUserItem(item))
          })}
        </ul>
      </div>
    )
  }
}

export default ContributorsModal;
